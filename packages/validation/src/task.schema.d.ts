import { z } from "zod";
export declare const acceptTaskSchema: z.ZodObject<{
    taskId: z.ZodString;
    workerEmail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    taskId: string;
    workerEmail?: string | undefined;
}, {
    taskId: string;
    workerEmail?: string | undefined;
}>;
export declare const submitProofSchema: z.ZodObject<{
    taskId: z.ZodString;
    screenshotUrl: z.ZodOptional<z.ZodString>;
    proofUrl: z.ZodOptional<z.ZodString>;
    proofText: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    taskId: string;
    screenshotUrl?: string | undefined;
    proofUrl?: string | undefined;
    proofText?: string | undefined;
}, {
    taskId: string;
    screenshotUrl?: string | undefined;
    proofUrl?: string | undefined;
    proofText?: string | undefined;
}>;
export declare const taskFeedSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
} & {
    platformSlug: z.ZodOptional<z.ZodString>;
    categorySlug: z.ZodOptional<z.ZodString>;
    minReward: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    sortBy?: string | undefined;
    platformSlug?: string | undefined;
    categorySlug?: string | undefined;
    minReward?: number | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    platformSlug?: string | undefined;
    categorySlug?: string | undefined;
    minReward?: number | undefined;
}>;
export declare const reviewProofSchema: z.ZodObject<{
    taskId: z.ZodString;
    status: z.ZodEnum<["PENDING", "VERIFIED", "REJECTED", "FLAGGED"]>;
    rejectionReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "VERIFIED" | "REJECTED" | "FLAGGED";
    taskId: string;
    rejectionReason?: string | undefined;
}, {
    status: "PENDING" | "VERIFIED" | "REJECTED" | "FLAGGED";
    taskId: string;
    rejectionReason?: string | undefined;
}>;
export declare const listTasksSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
} & {
    orderId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["AVAILABLE", "ASSIGNED", "SUBMITTED", "VERIFIED", "REJECTED", "EXPIRED", "FLAGGED", "PAID"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    status?: "VERIFIED" | "REJECTED" | "FLAGGED" | "AVAILABLE" | "ASSIGNED" | "SUBMITTED" | "EXPIRED" | "PAID" | undefined;
    sortBy?: string | undefined;
    orderId?: string | undefined;
}, {
    status?: "VERIFIED" | "REJECTED" | "FLAGGED" | "AVAILABLE" | "ASSIGNED" | "SUBMITTED" | "EXPIRED" | "PAID" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    orderId?: string | undefined;
}>;
export type AcceptTaskInput = z.infer<typeof acceptTaskSchema>;
export type SubmitProofInput = z.infer<typeof submitProofSchema>;
export type TaskFeedInput = z.infer<typeof taskFeedSchema>;
export type ReviewProofInput = z.infer<typeof reviewProofSchema>;
export type ListTasksInput = z.infer<typeof listTasksSchema>;
//# sourceMappingURL=task.schema.d.ts.map