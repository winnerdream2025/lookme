import { z } from "zod";
export declare const depositSchema: z.ZodObject<{
    amount: z.ZodNumber;
    stripePaymentMethodId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: number;
    stripePaymentMethodId: string;
}, {
    amount: number;
    stripePaymentMethodId: string;
}>;
export declare const withdrawSchema: z.ZodObject<{
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    amount: number;
}, {
    amount: number;
}>;
export declare const requestWithdrawalSchema: z.ZodObject<{
    amount: z.ZodNumber;
    method: z.ZodEnum<["PAYPAL", "MOBILE_MONEY"]>;
    accountDetails: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: number;
    method: "PAYPAL" | "MOBILE_MONEY";
    accountDetails: string;
}, {
    amount: number;
    method: "PAYPAL" | "MOBILE_MONEY";
    accountDetails: string;
}>;
export declare const reviewWithdrawalSchema: z.ZodObject<{
    requestId: z.ZodString;
    action: z.ZodEnum<["APPROVE", "REJECT"]>;
    adminNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    requestId: string;
    action: "APPROVE" | "REJECT";
    adminNotes?: string | undefined;
}, {
    requestId: string;
    action: "APPROVE" | "REJECT";
    adminNotes?: string | undefined;
}>;
export declare const confirmPaymentSchema: z.ZodObject<{
    requestId: z.ZodString;
    paymentProofUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    requestId: string;
    paymentProofUrl: string;
}, {
    requestId: string;
    paymentProofUrl: string;
}>;
export declare const workerConfirmSchema: z.ZodObject<{
    requestId: z.ZodString;
    received: z.ZodBoolean;
    disputeReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    received: boolean;
    requestId: string;
    disputeReason?: string | undefined;
}, {
    received: boolean;
    requestId: string;
    disputeReason?: string | undefined;
}>;
export declare const listTransactionsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
} & {
    type: z.ZodOptional<z.ZodEnum<["DEPOSIT", "ESCROW_LOCK", "ESCROW_RELEASE", "ESCROW_REFUND", "WITHDRAWAL", "PLATFORM_FEE", "REWARD"]>>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "COMPLETED", "FAILED", "CANCELLED"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    type?: "DEPOSIT" | "ESCROW_LOCK" | "ESCROW_RELEASE" | "ESCROW_REFUND" | "WITHDRAWAL" | "PLATFORM_FEE" | "REWARD" | undefined;
    status?: "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED" | undefined;
    sortBy?: string | undefined;
}, {
    type?: "DEPOSIT" | "ESCROW_LOCK" | "ESCROW_RELEASE" | "ESCROW_REFUND" | "WITHDRAWAL" | "PLATFORM_FEE" | "REWARD" | undefined;
    status?: "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawInput = z.infer<typeof withdrawSchema>;
export type RequestWithdrawalInput = z.infer<typeof requestWithdrawalSchema>;
export type ReviewWithdrawalInput = z.infer<typeof reviewWithdrawalSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
export type WorkerConfirmInput = z.infer<typeof workerConfirmSchema>;
export type ListTransactionsInput = z.infer<typeof listTransactionsSchema>;
//# sourceMappingURL=wallet.schema.d.ts.map