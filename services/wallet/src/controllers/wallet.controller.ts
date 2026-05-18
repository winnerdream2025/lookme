import { Request, Response, NextFunction } from "express";
import { WalletService } from "../services/wallet.service";
import { success } from "@lookme/utils";
import type {
  DepositInput,
  WithdrawInput,
  ListTransactionsInput,
  RequestWithdrawalInput,
  ReviewWithdrawalInput,
  ConfirmPaymentInput,
  WorkerConfirmInput,
} from "@lookme/validation";

const walletService = new WalletService();

function getUserId(req: Request): string {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    throw new Error("Missing x-user-id header");
  }
  return userId;
}

export class WalletController {
  async getBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await walletService.getBalance(getUserId(req));
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async listTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as ListTransactionsInput;
      const result = await walletService.listTransactions(getUserId(req), query);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as DepositInput;
      const result = await walletService.deposit(getUserId(req), body);
      res.status(201).json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async withdraw(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as WithdrawInput;
      const result = await walletService.withdraw(getUserId(req), body);
      res.status(201).json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async getMyWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const wallet = await walletService.getMyWallet(getUserId(req));
      res.json(success(wallet));
    } catch (err) {
      next(err);
    }
  }

  // ─── Worker: request a manual withdrawal ─────────────────────────────────
  async requestWithdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as RequestWithdrawalInput;
      const result = await walletService.requestWithdrawal(getUserId(req), body);
      res.status(201).json(success(result));
    } catch (err) {
      next(err);
    }
  }

  // ─── Worker: list my withdrawal requests ────────────────────────────────
  async listMyWithdrawals(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await walletService.listMyWithdrawals(getUserId(req));
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  // ─── Worker: confirm receipt or dispute ──────────────────────────────────
  async workerConfirm(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as WorkerConfirmInput;
      const result = await walletService.workerConfirm(getUserId(req), body);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  // ─── Admin: list pending withdrawals ────────────────────────────────────
  async listPendingWithdrawals(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await walletService.listPendingWithdrawals();
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  // ─── Admin: approve or reject withdrawal ────────────────────────────────
  async reviewWithdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as ReviewWithdrawalInput;
      const result = await walletService.reviewWithdrawal(getUserId(req), body);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  // ─── Admin: confirm payment sent ────────────────────────────────────────
  async confirmPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as ConfirmPaymentInput;
      const result = await walletService.confirmPayment(getUserId(req), body);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  // ─── Admin: export approved withdrawals to CSV ──────────────────────────
  async exportPayoutsCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const csv = await walletService.exportPayoutsCsv();
      const filename = `payouts-${new Date().toISOString().split("T")[0]}.csv`;
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (err) {
      next(err);
    }
  }
}
