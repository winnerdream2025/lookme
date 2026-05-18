export type TaskStatusType = "AVAILABLE" | "ASSIGNED" | "SUBMITTED" | "VERIFIED" | "REJECTED" | "EXPIRED" | "FLAGGED" | "PAID";
export type ProofStatusType = "PENDING" | "VERIFIED" | "REJECTED" | "FLAGGED";
export interface TaskDTO {
    id: string;
    orderId: string;
    workerId?: string;
    status: TaskStatusType;
    instructions: string;
    targetUrl: string;
    targetUsername?: string;
    rewardAmount: number;
    assignedAt?: string;
    submittedAt?: string;
    verifiedAt?: string;
    expiresAt?: string;
    createdAt: string;
}
export interface TaskFeedItem {
    id: string;
    instructions: string;
    targetUrl: string;
    rewardAmount: number;
    platformName: string;
    platformSlug: string;
    categoryName: string;
    categorySlug: string;
    serviceName: string;
}
export interface TaskProofDTO {
    id: string;
    taskId: string;
    screenshotUrl?: string;
    proofUrl?: string;
    proofText?: string;
    status: ProofStatusType;
    rejectionReason?: string;
    createdAt: string;
}
export interface TrustScoreDTO {
    userId: string;
    score: number;
    totalTasks: number;
    verifiedTasks: number;
    rejectedTasks: number;
    flaggedTasks: number;
}
//# sourceMappingURL=task.d.ts.map