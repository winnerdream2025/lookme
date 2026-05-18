import { z } from "zod";
import { paginationSchema } from "./common.schema";

const transactionTypes = [
  "DEPOSIT",
  "ESCROW_LOCK",
  "ESCROW_RELEASE",
  "ESCROW_REFUND",
  "WITHDRAWAL",
  "PLATFORM_FEE",
  "REWARD",
] as const;

const transactionStatuses = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
] as const;

export const depositSchema = z.object({
  amount: z.number().positive().min(5, "Minimum deposit is $5"),
  stripePaymentMethodId: z.string().min(1),
});

export const withdrawSchema = z.object({
  amount: z.number().positive().min(5, "Minimum withdrawal is $5"),
});

export const requestWithdrawalSchema = z.object({
  amount: z.number().positive().min(5, "Minimum withdrawal is $5"),
  method: z.enum(["PAYPAL", "MOBILE_MONEY"]),
  accountDetails: z.string().min(3, "Account details are required").max(200),
});

export const reviewWithdrawalSchema = z.object({
  requestId: z.string().cuid(),
  action: z.enum(["APPROVE", "REJECT"]),
  adminNotes: z.string().max(500).optional(),
});

export const confirmPaymentSchema = z.object({
  requestId: z.string().cuid(),
  paymentProofUrl: z.string().url().min(1, "Payment proof URL is required"),
});

export const workerConfirmSchema = z.object({
  requestId: z.string().cuid(),
  received: z.boolean(),
  disputeReason: z.string().max(1000).optional(),
});

export const listTransactionsSchema = paginationSchema.extend({
  type: z.enum(transactionTypes).optional(),
  status: z.enum(transactionStatuses).optional(),
});

export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawInput = z.infer<typeof withdrawSchema>;
export type RequestWithdrawalInput = z.infer<typeof requestWithdrawalSchema>;
export type ReviewWithdrawalInput = z.infer<typeof reviewWithdrawalSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
export type WorkerConfirmInput = z.infer<typeof workerConfirmSchema>;
export type ListTransactionsInput = z.infer<typeof listTransactionsSchema>;
