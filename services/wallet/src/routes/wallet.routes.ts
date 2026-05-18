import { Router, type Router as ExpressRouter } from "express";
import { WalletController } from "../controllers/wallet.controller";
import { validate, requireAdmin } from "@lookme/server";
import {
  depositSchema,
  withdrawSchema,
  listTransactionsSchema,
  requestWithdrawalSchema,
  reviewWithdrawalSchema,
  confirmPaymentSchema,
  workerConfirmSchema,
} from "@lookme/validation";

const router: ExpressRouter = Router();
const controller = new WalletController();

// Worker endpoints
router.get("/me", controller.getMyWallet);
router.get("/balance", controller.getBalance);
router.get("/transactions", validate(listTransactionsSchema, "query"), controller.listTransactions);
router.post("/deposit", validate(depositSchema), controller.deposit);
// NOTE: /withdraw is intentionally removed — manual /withdrawals/request flow replaces it
router.post("/withdrawals/request", validate(requestWithdrawalSchema), controller.requestWithdrawal);
router.get("/withdrawals/mine", controller.listMyWithdrawals);
router.post("/withdrawals/confirm", validate(workerConfirmSchema), controller.workerConfirm);

// Admin endpoints
router.get("/withdrawals/pending", requireAdmin, controller.listPendingWithdrawals);
router.post("/withdrawals/review", requireAdmin, validate(reviewWithdrawalSchema), controller.reviewWithdrawal);
router.post("/withdrawals/pay", requireAdmin, validate(confirmPaymentSchema), controller.confirmPayment);
router.get("/withdrawals/export-csv", requireAdmin, controller.exportPayoutsCsv);

export { router as walletRoutes };
