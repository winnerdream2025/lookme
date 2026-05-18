import { z } from "zod";
import { paginationSchema } from "./common.schema";

const proofStatuses = ["PENDING", "VERIFIED", "REJECTED", "FLAGGED"] as const;

// ─── Worker Actions ───

export const acceptTaskSchema = z.object({
  taskId: z.string().cuid(),
  workerEmail: z.string().email().optional(), // required for review tasks
});

export const submitProofSchema = z.object({
  taskId: z.string().cuid(),
  // Review/followers/likes tasks — image uploaded via /upload-screenshot, URL returned by S3
  screenshotUrl: z.string().url().optional(),
  proofText: z.string().min(1).max(2000).optional(),
  // Video/traffic tasks — HMAC token from /media-session proves the worker watched via the platform
  mediaSessionToken: z.string().optional(),
  duration: z.number().int().nonnegative().optional(),
});

// ─── Worker Feed ───

export const taskFeedSchema = paginationSchema.extend({
  platformSlug: z.string().optional(),
  categorySlug: z.string().optional(),
  minReward: z.coerce.number().positive().optional(),
});

// ─── Admin Actions ───

export const reviewProofSchema = z.object({
  taskId: z.string().cuid(),
  status: z.enum(proofStatuses),
  rejectionReason: z.string().max(2000).optional(),
});

export const listTasksSchema = paginationSchema.extend({
  orderId: z.string().cuid().optional(),
  status: z.enum(["AVAILABLE", "ASSIGNED", "SUBMITTED", "VERIFIED", "REJECTED", "EXPIRED", "FLAGGED", "PAID"]).optional(),
});

export type AcceptTaskInput = z.infer<typeof acceptTaskSchema>;
export type SubmitProofInput = z.infer<typeof submitProofSchema>;
export type TaskFeedInput = z.infer<typeof taskFeedSchema>;
export type ReviewProofInput = z.infer<typeof reviewProofSchema>;
export type ListTasksInput = z.infer<typeof listTasksSchema>;
