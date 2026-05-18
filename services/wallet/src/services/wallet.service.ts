import { prisma } from "@lookme/database";
import { createLogger } from "@lookme/logger";
import { paginate, paginationMeta, publishEvent } from "@lookme/utils";
import { AppError } from "@lookme/server";
import type {
  DepositInput,
  WithdrawInput,
  ListTransactionsInput,
  RequestWithdrawalInput,
  ReviewWithdrawalInput,
  ConfirmPaymentInput,
  WorkerConfirmInput,
} from "@lookme/validation";
import { WalletRepository } from "../repositories/wallet.repository";

const logger = createLogger("wallet-service");
const repo = new WalletRepository();

export class WalletService {
  async getBalance(userId: string) {
    const wallet = await repo.findWalletByUserId(userId);
    if (!wallet) {
      const err = new Error("Wallet not found") as Error & { status: number; code: string };
      err.status = 404;
      err.code = "WALLET_NOT_FOUND";
      throw err;
    }
    return {
      balance: wallet.balance,
      pendingBalance: wallet.pendingBalance,
      totalEarned: wallet.totalEarned,
      totalSpent: wallet.totalSpent,
      currency: wallet.currency,
    };
  }

  async getMyWallet(userId: string) {
    let wallet = await repo.findWalletByUserId(userId);
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, balance: 0, pendingBalance: 0, totalEarned: 0, totalSpent: 0, totalWithdrawn: 0, currency: "USD" },
      });
    }
    const w = wallet;

    // Get pending tasks with hold countdown
    const pendingTasks = await prisma.task.findMany({
      where: {
        workerId: userId,
        status: "VERIFIED",
        expiresAt: { gt: new Date() }
      },
      select: {
        id: true,
        rewardAmount: true,
        expiresAt: true
      },
      orderBy: { expiresAt: "asc" },
      take: 20
    });

    const transactions = await prisma.transaction.findMany({
      where: { walletId: w.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return {
      balance: Number(w.balance),
      pendingBalance: Number(w.pendingBalance),
      totalEarned: Number(w.totalEarned),
      totalSpent: Number(w.totalSpent),
      totalWithdrawn: Number(w.totalWithdrawn),
      currency: w.currency,
      minimumWithdrawal: 5,
      pendingTasks: pendingTasks.map(t => ({
        id: t.id,
        amount: Number(t.rewardAmount) * 0.7,
        availableAt: t.expiresAt
      })),
      transactions: transactions.map((t: { id: string; type: string; amount: unknown; status: string; description: string | null; createdAt: Date }) => ({
        id: t.id,
        type: t.type,
        amount: Number(t.amount),
        status: t.status,
        description: t.description,
        createdAt: t.createdAt,
      })),
    };
  }

  async listTransactions(userId: string, query: ListTransactionsInput) {
    const wallet = await repo.findWalletByUserId(userId);
    if (!wallet) {
      const err = new Error("Wallet not found") as Error & { status: number; code: string };
      err.status = 404;
      err.code = "WALLET_NOT_FOUND";
      throw err;
    }

    const { skip, take } = paginate(query.page, query.limit);
    const where: Record<string, unknown> = { walletId: wallet.id };
    if (query.type) where.type = query.type.toUpperCase();
    if (query.status) where.status = query.status.toUpperCase();

    const [transactions, total] = await Promise.all([
      repo.findTransactions({ where, skip, take }),
      repo.countTransactions(where),
    ]);

    return {
      transactions,
      meta: paginationMeta(total, query.page, query.limit),
    };
  }

  async deposit(userId: string, input: DepositInput) {
    const wallet = await repo.findWalletByUserId(userId);
    if (!wallet) {
      const err = new Error("Wallet not found") as Error & { status: number; code: string };
      err.status = 404;
      err.code = "WALLET_NOT_FOUND";
      throw err;
    }

    const transaction = await repo.createTransaction({
      walletId: wallet.id,
      type: "DEPOSIT",
      amount: input.amount,
      description: "Deposit",
      referenceId: input.stripePaymentMethodId,
    });

    await repo.updateBalance(wallet.id, Number(wallet.balance) + input.amount);
    logger.info({ userId, amount: input.amount, transactionId: transaction.id }, "Deposit completed");
    return transaction;
  }

  async withdraw(userId: string, input: WithdrawInput) {
    const wallet = await repo.findWalletByUserId(userId);
    if (!wallet) {
      const err = new Error("Wallet not found") as Error & { status: number; code: string };
      err.status = 404;
      err.code = "WALLET_NOT_FOUND";
      throw err;
    }

    if (Number(wallet.balance) < input.amount) {
      const err = new Error("Insufficient balance") as Error & { status: number; code: string };
      err.status = 400;
      err.code = "WALLET_INSUFFICIENT_BALANCE";
      throw err;
    }

    const transaction = await repo.createTransaction({
      walletId: wallet.id,
      type: "WITHDRAWAL",
      amount: input.amount,
      description: "Withdrawal",
    });

    await repo.updateBalance(wallet.id, Number(wallet.balance) - input.amount);
    logger.info({ userId, amount: input.amount, transactionId: transaction.id }, "Withdrawal initiated");
    return transaction;
  }

  // ─── Worker: request a manual withdrawal ─────────────────────────────────
  async requestWithdrawal(userId: string, input: RequestWithdrawalInput) {
    const wallet = await repo.findWalletByUserId(userId);
    if (!wallet) {
      throw AppError.notFound("WALLET_NOT_FOUND", "Wallet not found");
    }

    const available = Number(wallet.balance);
    const pending = Number(wallet.pendingBalance);

    if (available < input.amount) {
      throw AppError.badRequest(
        "WALLET_INSUFFICIENT_BALANCE",
        `Insufficient available balance. You have $${available.toFixed(2)} available and $${pending.toFixed(2)} pending.`
      );
    }

    if (input.amount < 5) {
      throw AppError.badRequest(
        "MINIMUM_NOT_MET",
        "Minimum withdrawal amount is $5"
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const newBalance = Number(wallet.balance) - input.amount;
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      });

      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: "WITHDRAWAL",
          amount: input.amount,
          status: "PENDING",
          description: `Withdrawal request via ${input.method}`,
        },
      });

      const request = await tx.withdrawalRequest.create({
        data: {
          userId,
          walletId: wallet.id,
          amount: input.amount,
          currency: wallet.currency,
          method: input.method,
          accountDetails: input.accountDetails,
          status: "PENDING",
          transactionId: transaction.id,
        },
      });

      return request;
    });

    logger.info({ userId, amount: input.amount, method: input.method, requestId: result.id }, "Withdrawal requested");
    return result;
  }

  // ─── Worker: list my withdrawals ─────────────────────────────────────────
  async listMyWithdrawals(userId: string) {
    const requests = await prisma.withdrawalRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return requests.map((r) => ({
      id: r.id,
      amount: Number(r.amount),
      currency: r.currency,
      method: r.method,
      accountDetails: r.accountDetails,
      status: r.status,
      adminNotes: r.adminNotes,
      paymentProofUrl: r.paymentProofUrl,
      workerConfirmed: r.workerConfirmed,
      disputeReason: r.disputeReason,
      createdAt: r.createdAt,
      reviewedAt: r.reviewedAt,
      paidAt: r.paidAt,
    }));
  }

  // ─── Admin: list pending withdrawals ─────────────────────────────────────
  async listPendingWithdrawals() {
    const requests = await prisma.withdrawalRequest.findMany({
      where: { status: { in: ["PENDING", "APPROVED"] } },
      orderBy: { createdAt: "asc" },
    });
    return requests.map((r) => ({
      id: r.id,
      userId: r.userId,
      amount: Number(r.amount),
      currency: r.currency,
      method: r.method,
      accountDetails: r.accountDetails,
      status: r.status,
      createdAt: r.createdAt,
    }));
  }

  // ─── Admin: export approved withdrawals to CSV ───────────────────────────
  async exportPayoutsCsv() {
    const requests = await prisma.withdrawalRequest.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "asc" },
    });

    // Get user emails
    const userIds = requests.map((r) => r.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const csvRows = [
      "Email,Amount,Currency,Method,Account Details,Request ID,Requested Date",
      ...requests.map((r) => {
        const user = userMap.get(r.userId);
        const email = user?.email || "N/A";
        const amount = Number(r.amount).toFixed(2);
        const accountDetails = `"${r.accountDetails.replace(/"/g, '""')}"`;
        const requestedDate = r.createdAt.toISOString().split("T")[0];
        
        return `${email},${amount},${r.currency},${r.method},${accountDetails},${r.id},${requestedDate}`;
      }),
    ];

    return csvRows.join("\n");
  }

  // ─── Admin: approve or reject withdrawal ─────────────────────────────────
  async reviewWithdrawal(adminId: string, input: ReviewWithdrawalInput) {
    const request = await prisma.withdrawalRequest.findUnique({ where: { id: input.requestId } });
    if (!request) {
      const err = new Error("Withdrawal request not found") as Error & { status: number; code: string };
      err.status = 404;
      err.code = "WITHDRAWAL_NOT_FOUND";
      throw err;
    }
    if (request.status !== "PENDING") {
      const err = new Error("Withdrawal request is not pending") as Error & { status: number; code: string };
      err.status = 400;
      err.code = "WITHDRAWAL_NOT_PENDING";
      throw err;
    }

    const newStatus = input.action === "APPROVE" ? "APPROVED" : "REJECTED";

    await prisma.$transaction(async (tx) => {
      await tx.withdrawalRequest.update({
        where: { id: input.requestId },
        data: {
          status: newStatus,
          adminNotes: input.adminNotes || null,
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
      });

      if (newStatus === "REJECTED") {
        await tx.wallet.update({
          where: { id: request.walletId },
          data: { balance: { increment: Number(request.amount) } },
        });
        await tx.transaction.update({
          where: { id: request.transactionId! },
          data: { status: "CANCELLED", description: "Withdrawal rejected by admin" },
        });
      }
    });

    logger.info({ adminId, requestId: input.requestId, action: input.action }, "Withdrawal reviewed");

    publishEvent("withdrawal:updated", {
      requestId: input.requestId,
      status: newStatus,
      userId: request.userId,
    }).catch(() => {});

    return { id: input.requestId, status: newStatus };
  }

  // ─── Admin: confirm payment sent ─────────────────────────────────────────
  async confirmPayment(adminId: string, input: ConfirmPaymentInput) {
    const request = await prisma.withdrawalRequest.findUnique({ where: { id: input.requestId } });
    if (!request) {
      const err = new Error("Withdrawal request not found") as Error & { status: number; code: string };
      err.status = 404;
      err.code = "WITHDRAWAL_NOT_FOUND";
      throw err;
    }
    if (request.status !== "APPROVED") {
      const err = new Error("Withdrawal must be approved before confirming payment") as Error & { status: number; code: string };
      err.status = 400;
      err.code = "WITHDRAWAL_NOT_APPROVED";
      throw err;
    }

    await prisma.$transaction(async (tx) => {
      await tx.withdrawalRequest.update({
        where: { id: input.requestId },
        data: {
          status: "PAID",
          paymentProofUrl: input.paymentProofUrl,
          paidAt: new Date(),
        },
      });

      await tx.wallet.update({
        where: { id: request.walletId },
        data: { totalWithdrawn: { increment: Number(request.amount) } },
      });

      await tx.transaction.update({
        where: { id: request.transactionId! },
        data: { status: "COMPLETED", description: "Withdrawal paid by admin" },
      });
    });

    logger.info({ adminId, requestId: input.requestId }, "Payment confirmed");

    publishEvent("withdrawal:updated", {
      requestId: input.requestId,
      status: "PAID",
      userId: request.userId,
    }).catch(() => {});

    return { id: input.requestId, status: "PAID" };
  }

  // ─── Worker: confirm receipt or dispute ──────────────────────────────────
  async workerConfirm(userId: string, input: WorkerConfirmInput) {
    const request = await prisma.withdrawalRequest.findFirst({
      where: { id: input.requestId, userId },
    });
    if (!request) {
      const err = new Error("Withdrawal request not found") as Error & { status: number; code: string };
      err.status = 404;
      err.code = "WITHDRAWAL_NOT_FOUND";
      throw err;
    }
    if (request.status !== "PAID") {
      const err = new Error("Payment has not been sent yet") as Error & { status: number; code: string };
      err.status = 400;
      err.code = "WITHDRAWAL_NOT_PAID";
      throw err;
    }
    if (request.workerConfirmed || request.disputeReason) {
      const err = new Error("Withdrawal has already been confirmed or disputed") as Error & { status: number; code: string };
      err.status = 400;
      err.code = "WITHDRAWAL_ALREADY_HANDLED";
      throw err;
    }

    if (input.received) {
      await prisma.withdrawalRequest.update({
        where: { id: input.requestId },
        data: {
          status: "RESOLVED",
          workerConfirmed: true,
          workerConfirmedAt: new Date(),
        },
      });
      logger.info({ userId, requestId: input.requestId }, "Worker confirmed receipt");
      return { id: input.requestId, status: "RESOLVED" };
    }

    if (!input.disputeReason?.trim()) {
      const err = new Error("Dispute reason is required") as Error & { status: number; code: string };
      err.status = 400;
      err.code = "DISPUTE_REASON_REQUIRED";
      throw err;
    }

    await prisma.withdrawalRequest.update({
      where: { id: input.requestId },
      data: {
        status: "DISPUTED",
        disputeReason: input.disputeReason.trim(),
        disputedAt: new Date(),
      },
    });

    logger.info({ userId, requestId: input.requestId, reason: input.disputeReason }, "Worker disputed payment");
    return { id: input.requestId, status: "DISPUTED" };
  }
}
