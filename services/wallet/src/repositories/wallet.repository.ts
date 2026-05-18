import { prisma } from "@lookme/database";

interface CreateTransactionInput {
  walletId: string;
  type: string;
  amount: number;
  description: string;
  referenceId?: string;
  referenceType?: string;
}

export class WalletRepository {
  async findWalletByUserId(userId: string) {
    return prisma.wallet.findUnique({ where: { userId } });
  }

  async findWalletById(id: string) {
    return prisma.wallet.findUnique({ where: { id } });
  }

  async updateBalance(walletId: string, newBalance: number) {
    return prisma.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance },
    });
  }

  async createTransaction(input: CreateTransactionInput) {
    return prisma.transaction.create({
      data: {
        walletId: input.walletId,
        type: input.type as never,
        amount: input.amount,
        description: input.description,
        referenceId: input.referenceId,
        referenceType: input.referenceType,
        status: "COMPLETED",
      },
    });
  }

  async findTransactions(opts: {
    where: Record<string, unknown>;
    skip: number;
    take: number;
  }) {
    return prisma.transaction.findMany({
      where: opts.where,
      skip: opts.skip,
      take: opts.take,
      orderBy: { createdAt: "desc" },
    });
  }

  async countTransactions(where: Record<string, unknown>) {
    return prisma.transaction.count({ where });
  }

  async createEscrow(data: {
    orderId: string;
    fromWalletId: string;
    totalAmount: number;
  }) {
    return prisma.escrow.create({
      data: {
        orderId: data.orderId,
        fromWalletId: data.fromWalletId,
        totalAmount: data.totalAmount,
        status: "HELD",
      },
    });
  }

  async releaseEscrow(escrowId: string) {
    return prisma.escrow.update({
      where: { id: escrowId },
      data: { status: "RELEASED", releasedAt: new Date() },
    });
  }
}
