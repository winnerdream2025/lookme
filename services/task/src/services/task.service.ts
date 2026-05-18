import crypto from "crypto";
import { prisma } from "@lookme/database";
import { AppError } from "@lookme/server";
import type { SubmitProofInput, ReviewProofInput } from "@lookme/validation";
import { createLogger } from "@lookme/logger";
import { publishEvent } from "@lookme/utils";
import { uploadToS3 } from "../utils/s3";
import {
  createMediaSessionToken,
  verifyMediaSessionToken,
  detectMediaType,
} from "../utils/hmac-session";

const logger = createLogger("task-service");

// ─── Shared shape transformer (Prisma → TaskItem) ────────────────────────────
function toTaskItem(t: any) {
  return {
    id: t.id,
    instructions: t.instructions,
    targetUrl: t.targetUrl,
    rewardAmount: Number(t.rewardAmount),
    scheduledFor: t.scheduledFor ? t.scheduledFor.toISOString() : undefined,
    platformName: t.order?.serviceType?.platform?.name ?? "",
    platformSlug: t.order?.serviceType?.platform?.slug ?? "",
    categoryName: t.order?.serviceType?.category?.name ?? "",
    categorySlug: t.order?.serviceType?.category?.slug ?? "",
    serviceName: t.order?.serviceType?.name ?? "",
    isReview: t.order?.serviceType?.category?.slug === "reviews",
    reviewRating: t.order?.reviewRating,
    reviewContent: t.order?.reviewContent,
    reviewLanguage: t.order?.reviewLanguage,
    businessName: t.order?.businessName,
    businessCountry: t.order?.businessCountry,
    requiredGender: t.order?.requiredGender,
    referenceImageUrl: t.order?.referenceImageUrl ?? null,
    requiresTimer: t.order?.serviceType?.requiresTimer ?? false,
    minViewDuration: t.order?.serviceType?.minViewDuration ?? 30,
    mediaType: t.order?.serviceType?.requiresTimer
      ? detectMediaType(t.targetUrl ?? "")
      : null,
    status: t.status,
    assignedAt: t.assignedAt ? t.assignedAt.toISOString() : undefined,
    expiresAt: t.expiresAt ? t.expiresAt.toISOString() : undefined,
    submittedAt: t.submittedAt ? t.submittedAt.toISOString() : undefined,
    proof: t.proof
      ? {
          status: t.proof.status,
          proofUrl: t.proof.proofUrl,
          screenshotUrl: t.proof.screenshotUrl,
          proofText: t.proof.proofText,
          rejectionReason: t.proof.rejectionReason,
        }
      : undefined,
  };
}

export class TaskService {
  async getFeed(workerId: string, query?: Record<string, unknown>) {
    const page = (query?.page as number) || 1;
    const limit = (query?.limit as number) || 20;
    const now = new Date();

    // ANTI-FRAUD: Get all URLs this worker has already viewed
    // GOLDEN RULE: 1 Worker = 1 IP = 1 View per URL
    const viewedUrls = await prisma.workerViewHistory.findMany({
      where: { workerId },
      select: { targetUrl: true },
    });
    const viewedUrlSet = new Set(viewedUrls.map(v => v.targetUrl));

    const tasks = await prisma.task.findMany({
      where: {
        status: "AVAILABLE",
        workerId: null,
        OR: [
          { scheduledFor: null },
          { scheduledFor: { lte: now } },
        ],
        ...(query?.platformSlug
          ? { order: { serviceType: { platform: { slug: query.platformSlug as string } } } }
          : {}),
        ...(query?.categorySlug
          ? { order: { serviceType: { category: { slug: query.categorySlug as string } } } }
          : {}),
      },
      include: {
        order: {
          include: { serviceType: { include: { platform: true, category: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit * 2, // Fetch more to account for filtering
    });

    // Filter out URLs worker has already viewed
    const filteredTasks = tasks
      .filter(t => !viewedUrlSet.has(t.targetUrl))
      .slice(0, limit);

    return filteredTasks.map(toTaskItem);
  }

  async acceptTask(workerId: string, taskId: string, workerEmail?: string, deviceFingerprint?: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { order: { include: { serviceType: { include: { category: true } } } } },
    });

    if (!task) {
      throw AppError.notFound("TASK_NOT_FOUND", "Task not found");
    }
    if (task.status !== "AVAILABLE") {
      throw AppError.badRequest("TASK_NOT_AVAILABLE", "Task is no longer available");
    }
    if (task.scheduledFor && task.scheduledFor > new Date()) {
      throw AppError.badRequest("TASK_NOT_YET_AVAILABLE", "This task is scheduled for a future date");
    }

    // C-02: Trust score eligibility gate — MUST run before any DB writes
    const trustScore = await prisma.trustScore.findUnique({ where: { userId: workerId } });
    if (trustScore) {
      if (trustScore.score === 0) {
        throw AppError.forbidden("Your account has been permanently suspended due to policy violations.");
      }
      const categorySlug = task.order.serviceType.category.slug;
      if (trustScore.score < 50 && Number(task.rewardAmount) > 1.0) {
        throw AppError.badRequest(
          "TRUST_SCORE_TOO_LOW",
          "Your trust score is too low for high-paying tasks. Complete basic tasks to rebuild your score."
        );
      }
      if (trustScore.score < 30 && categorySlug === "reviews") {
        throw AppError.badRequest(
          "TRUST_SCORE_TOO_LOW",
          "Your trust score is too low for review tasks. Focus on simpler tasks to rebuild trust."
        );
      }
    }

    // Enforce max 3 active tasks per worker
    const activeCount = await prisma.task.count({
      where: { workerId, status: "ASSIGNED" },
    });
    if (activeCount >= 3) {
      throw AppError.badRequest("TASK_LIMIT_REACHED", "You can only have 3 active tasks at a time. Complete or submit one first.");
    }

    const isReview = task.order.serviceType.category.slug === "reviews";
    const isTrafficTask = ["views", "traffic", "visits"].includes(task.order.serviceType.category.slug);

    // ANTI-FRAUD: Check if worker has already viewed this URL
    // GOLDEN RULE: 1 Worker = 1 IP = 1 View per URL (prevents YouTube/Google spam detection)
    if (isTrafficTask) {
      const alreadyViewed = await prisma.workerViewHistory.findUnique({
        where: { workerId_targetUrl: { workerId, targetUrl: task.targetUrl } },
      });
      if (alreadyViewed) {
        throw AppError.badRequest(
          "URL_ALREADY_VIEWED",
          "You have already viewed this URL. Each worker can only view a unique URL once to prevent spam detection by YouTube/Google Analytics."
        );
      }
    }

    if (isReview) {
      if (!workerEmail) {
        throw AppError.badRequest(
          "EMAIL_REQUIRED",
          "You must provide the Gmail/Google account email you will use to post this review"
        );
      }

      // CRITICAL: Check if device has already reviewed this business
      // Prevents worker from using 5 different Google accounts on same phone
      if (deviceFingerprint) {
        const deviceUsed = await prisma.workerEmailUsage.findUnique({
          where: { deviceFingerprint_targetUrl: { deviceFingerprint, targetUrl: task.targetUrl } },
        });
        if (deviceUsed) {
          throw AppError.badRequest(
            "DEVICE_ALREADY_USED",
            "This device has already been used to review this business. Google tracks device hardware IDs and will delete duplicate reviews from the same device. Please use a different physical device."
          );
        }
      }

      const alreadyDidOrder = await prisma.workerEmailUsage.findUnique({
        where: { workerId_orderId: { workerId, orderId: task.orderId } },
      });
      if (alreadyDidOrder) {
        throw AppError.badRequest(
          "ALREADY_REVIEWED_ORDER",
          "You have already submitted a review for this business in this order. Each worker may only post one review per business."
        );
      }

      const emailUsed = await prisma.workerEmailUsage.findUnique({
        where: { email_targetUrl: { email: workerEmail, targetUrl: task.targetUrl } },
      });
      if (emailUsed) {
        throw AppError.badRequest(
          "EMAIL_ALREADY_USED",
          `The email ${workerEmail} has already been used to review this business. Please use a different Google account.`
        );
      }
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);

    const updated = await prisma.$transaction(async (tx) => {
      // ATOMIC CLAIM: only succeeds if task is still AVAILABLE and unassigned
      // Prevents race condition when 100+ workers click simultaneously (TOCTOU fix)
      const claimed = await tx.task.updateMany({
        where: { id: taskId, status: "AVAILABLE", workerId: null },
        data: {
          workerId,
          status: "ASSIGNED",
          assignedAt: now,
          expiresAt,
          ...(isReview && workerEmail ? { workerEmail } : {}),
          ...(deviceFingerprint ? { deviceFingerprint } : {}),
        },
      });

      if (claimed.count === 0) {
        throw AppError.conflict(
          "TASK_ALREADY_TAKEN",
          "This task was just taken by another worker. Please choose a different task from the feed."
        );
      }

      const updatedTask = await tx.task.findUnique({ where: { id: taskId } });

      if (isReview && workerEmail) {
        await tx.workerEmailUsage.create({
          data: {
            workerId,
            email: workerEmail,
            targetUrl: task.targetUrl,
            orderId: task.orderId,
            taskId,
            deviceFingerprint: deviceFingerprint || null,
          },
        });
      }

      return updatedTask;
    });

    return updated!;
  }

  // ─── Create signed HMAC media session ────────────────────────────────────
  // DB is the source of truth — heartbeats accumulate activeSeconds server-side.
  // Postman cannot forge tokens and cannot fake activeSeconds in DB.
  async createMediaSession(workerId: string, taskId: string, reqIp?: string, reqUA?: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { order: { include: { serviceType: true } } },
    });

    if (!task) throw AppError.notFound("TASK_NOT_FOUND", "Task not found");
    if (task.workerId !== workerId) throw AppError.forbidden("This task is not assigned to you");
    if (task.status !== "ASSIGNED") throw AppError.badRequest("TASK_NOT_ACTIVE", "Task must be ASSIGNED to start a media session");

    const requiredSeconds = task.order.serviceType.minViewDuration ?? 30;
    const mediaType = detectMediaType(task.targetUrl);

    const token = createMediaSessionToken({
      taskId,
      workerId,
      issuedAt: Date.now(),
      requiredSeconds,
      mediaType,
    });

    // Upsert — invalidate any stale session for this task
    await prisma.mediaSession.upsert({
      where: { taskId },
      create: {
        taskId,
        workerId,
        token,
        ipAddress: reqIp ?? null,
        userAgent: reqUA ?? null,
        activeSeconds: 0,
        status: "ACTIVE",
      },
      update: {
        workerId,
        token,
        ipAddress: reqIp ?? null,
        userAgent: reqUA ?? null,
        activeSeconds: 0,
        status: "ACTIVE",
        startedAt: new Date(),
        lastHeartbeatAt: new Date(),
      },
    });

    return { sessionToken: token, requiredSeconds, mediaType };
  }

  // ─── Heartbeat ────────────────────────────────────────────────────────────
  // Frontend calls this every 5s during playback.
  // Only PLAYING heartbeats accumulate activeSeconds (clamped to 10s max).
  // This makes the DB the source of truth — forging duration via Postman is impossible.
  async heartbeat(
    workerId: string,
    body: { taskId: string; sessionToken: string; playerState: "PLAYING" | "PAUSED" | "ENDED" }
  ) {
    verifyMediaSessionToken(body.sessionToken, body.taskId, workerId);

    const dbSession = await prisma.mediaSession.findUnique({
      where: { taskId: body.taskId },
    });

    if (!dbSession || dbSession.status === "EXPIRED") {
      throw AppError.badRequest("SESSION_EXPIRED", "Media session expired or invalid");
    }
    if (dbSession.workerId !== workerId) {
      throw AppError.forbidden("Not your media session");
    }

    const now = Date.now();
    const elapsedSec = Math.floor((now - dbSession.lastHeartbeatAt.getTime()) / 1000);
    const clampedElapsed = Math.min(elapsedSec, 10); // Anti-spam: max 10s per heartbeat

    let newActiveSeconds = dbSession.activeSeconds;
    if (body.playerState === "PLAYING" && dbSession.status !== "COMPLETED") {
      newActiveSeconds += clampedElapsed;
    }

    const newStatus =
      body.playerState === "ENDED" ? "COMPLETED" :
      body.playerState === "PAUSED" ? "PAUSED" :
      "ACTIVE";

    const updated = await prisma.mediaSession.update({
      where: { id: dbSession.id },
      data: {
        activeSeconds: newActiveSeconds,
        lastHeartbeatAt: new Date(now),
        status: newStatus,
      },
    });

    const tokenData = verifyMediaSessionToken(body.sessionToken, body.taskId, workerId);
    const isComplete = updated.activeSeconds >= tokenData.requiredSeconds;

    return { activeSeconds: updated.activeSeconds, requiredSeconds: tokenData.requiredSeconds, isComplete };
  }

  async submitProof(workerId: string, input: SubmitProofInput & { ipAddress?: string; userAgent?: string; duration?: number; mediaSessionToken?: string }) {
    const task = await prisma.task.findUnique({
      where: { id: input.taskId },
      include: {
        order: {
          include: {
            serviceType: {
              include: { category: true }
            }
          }
        }
      }
    });

    if (!task || task.workerId !== workerId) {
      throw AppError.notFound("TASK_NOT_FOUND", "Task not found or not assigned to you");
    }
    if (task.status !== "ASSIGNED") {
      throw AppError.badRequest("TASK_NOT_ASSIGNED", "Task is not in assigned state");
    }

    const categorySlug = task.order.serviceType.category.slug;

    // Check if this is a followers task or traffic task
    const isFollowers = categorySlug === "followers";
    const isTrafficTask = ["views", "traffic", "visits"].includes(categorySlug);
    const isReviewTask = categorySlug === "reviews";

    // Proof-type enforcement:
    // - Review tasks: screenshot of the published review is mandatory (image upload via /upload-screenshot)
    // - Timer tasks (video/traffic/streams): HMAC media session is the proof — NO screenshot required
    if (isReviewTask && !input.screenshotUrl) {
      throw AppError.badRequest(
        "SCREENSHOT_REQUIRED",
        "Review tasks require a screenshot of your published review. Upload an image using the upload button."
      );
    }

    // Get worker trust score
    const trustScore = await prisma.trustScore.findUnique({
      where: { userId: workerId }
    });
    const score = trustScore?.score ?? 50;

    // Check if this is a timer-based task
    const isTimerTask = task.order.serviceType.requiresTimer;
    const minDuration = task.order.serviceType.minViewDuration || 30;
    let backendDuration = 0;

    // ANTI-BOT: Timer tasks verify HMAC + read activeSeconds from DB (never trust client)
    if (isTimerTask) {
      if (!input.mediaSessionToken) {
        throw AppError.badRequest(
          "MEDIA_SESSION_REQUIRED",
          "You must watch the media content through the task page. Direct API submission is blocked."
        );
      }
      // 1. Verify HMAC signature
      verifyMediaSessionToken(input.mediaSessionToken, input.taskId, workerId);
      // 2. Read source of truth from DB — this is what heartbeats accumulated
      const dbSession = await prisma.mediaSession.findUnique({
        where: { taskId: input.taskId },
      });
      if (!dbSession) {
        throw AppError.badRequest(
          "NO_MEDIA_SESSION",
          "No media session found. Use the task page to watch content before submitting."
        );
      }
      backendDuration = dbSession.activeSeconds;
      if (backendDuration < minDuration) {
        throw AppError.badRequest(
          "INSUFFICIENT_WATCH_TIME",
          `Active watch time: ${backendDuration}s. Required: ${minDuration}s. Do not pause, mute, or switch tabs.`
        );
      }
      // 3. Invalidate session — prevents resubmission with same token
      await prisma.mediaSession.update({
        where: { id: dbSession.id },
        data: { status: "EXPIRED", token: "USED_" + dbSession.id },
      });
    }

    const hasMetDuration = isTimerTask ? backendDuration >= minDuration : true;

    // Auto-approve conditions:
    // 1. Followers tasks with trust >= 50  (review anti-fraud already enforced at /accept)
    // 2. Timer-based tasks (video/traffic) that accumulated enough active seconds in DB
    const shouldAutoApprove =
      (isFollowers && score >= 50) ||
      (isTimerTask && hasMetDuration);

    // C-03: 5% random audit OVERRIDES auto-approve — task stays SUBMITTED for human review
    // Real IP is always preserved (no AUDIT string hack)
    const shouldSample = shouldAutoApprove && Math.random() < 0.05;
    const finalAutoApprove = shouldAutoApprove && !shouldSample;

    const [updatedTask, proof] = await prisma.$transaction(async (tx) => {
      const proof = await tx.taskProof.create({
        data: {
          taskId: input.taskId,
          screenshotUrl: input.screenshotUrl || null,
          screenshotHash: (input as any).screenshotHash || null,
          proofText: input.proofText || null,
          status: finalAutoApprove ? "VERIFIED" : "PENDING",
        },
      });

      const updatedTask = await tx.task.update({
        where: { id: input.taskId },
        data: {
          status: finalAutoApprove ? "VERIFIED" : "SUBMITTED",
          submittedAt: new Date(),
          ipAddress: input.ipAddress || task.ipAddress,
          userAgent: input.userAgent || task.userAgent,
        },
      });

      // ANTI-FRAUD: Record view history for traffic tasks
      // This enforces the GOLDEN RULE: 1 Worker = 1 IP = 1 View per URL
      if (isTrafficTask) {
        await tx.workerViewHistory.create({
          data: {
            workerId,
            targetUrl: task.targetUrl,
            orderId: task.orderId,
            taskId: input.taskId,
            ipAddress: input.ipAddress || "unknown",
            userAgent: input.userAgent || null,
            duration: input.duration || null,
          },
        });
      }

      // If auto-approved (and NOT sampled for audit), credit wallet with hold period
      if (finalAutoApprove) {
        const holdHours = 24; // 24h hold for followers
        const holdUntil = new Date(Date.now() + holdHours * 3600000);
        const reward = Number(task.rewardAmount);
        // Use dynamic platform fee from order (defaults to 30% if not set)
        const platformFeePct = Number(task.order.platformFeePercent ?? 30) / 100;
        const workerPayout = reward * (1 - platformFeePct);

        const wallet = await tx.wallet.findUnique({
          where: { userId: workerId }
        });

        if (wallet) {
          await tx.wallet.update({
            where: { id: wallet.id },
            data: {
              pendingBalance: { increment: workerPayout },
              totalEarned: { increment: workerPayout },
            },
          });

          await tx.transaction.create({
            data: {
              walletId: wallet.id,
              type: "REWARD",
              amount: workerPayout,
              status: "PENDING",
              description: `Auto-approved (hold ${holdHours}h)`,
              referenceId: task.id,
              referenceType: "task",
            },
          });

          await tx.task.update({
            where: { id: input.taskId },
            data: {
              verifiedAt: new Date(),
              expiresAt: holdUntil,
            },
          });

          // Increment order completed count
          await tx.order.update({
            where: { id: task.orderId },
            data: { completedQty: { increment: 1 } },
          });
        }
      }

      return [updatedTask, proof];
    });

    logger.info({
      taskId: input.taskId,
      autoApproved: finalAutoApprove,
      sampledForAudit: shouldSample,
      trustScore: score,
    }, "Proof submitted");

    publishEvent("task:updated", {
      taskId: input.taskId,
      status: updatedTask.status,
      workerId,
    }).catch(() => {});

    return { task: updatedTask, proof };
  }

  async uploadScreenshot(buffer: Buffer, originalName: string, mimeType: string) {
    // Compute SHA-256 server-side — client cannot forge this
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Reject duplicate screenshots: same image submitted by multiple workers = fraud
    const existing = await prisma.taskProof.findFirst({
      where: { screenshotHash: hash },
      select: { taskId: true },
    });
    if (existing) {
      throw AppError.badRequest(
        "DUPLICATE_SCREENSHOT",
        "This screenshot has already been used. Each worker must upload their own unique screenshot."
      );
    }

    const url = await uploadToS3(buffer, originalName, mimeType);
    return { url, hash };
  }

  async listWorkerTasks(workerId: string) {
    const tasks = await prisma.task.findMany({
      where: { workerId },
      include: { proof: true, order: { include: { serviceType: { include: { platform: true, category: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return tasks.map(toTaskItem);
  }

  async getById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { proof: true, order: { include: { serviceType: { include: { platform: true, category: true } } } } },
    });
    if (!task) {
      throw AppError.notFound("TASK_NOT_FOUND", "Task not found");
    }
    return toTaskItem(task);
  }

  async listAll(query?: Record<string, unknown>) {
    const page = (query?.page as number) || 1;
    const limit = (query?.limit as number) || 50;
    const where: Record<string, unknown> = {};

    if (query?.orderId) where.orderId = query.orderId;
    if (query?.status) where.status = query.status;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: { proof: true, worker: { select: { id: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return { tasks, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── Cron: release held payments after hold period ───────────────────────
  // NOTE: This logic runs inline in task/src/index.ts cron job (every 15 min).
  // This method is kept for reference only — do not call directly.
  // Runs every hour. Moves pendingBalance → balance for VERIFIED tasks past holdUntil.
  async releaseHeldPayments() {
    const now = new Date();

    // VERIFIED tasks use expiresAt as "holdUntil" (set by reviewProof)
    const tasksToRelease = await prisma.task.findMany({
      where: { status: "VERIFIED", expiresAt: { lte: now } },
      select: { id: true, workerId: true, rewardAmount: true, orderId: true },
    });

    if (tasksToRelease.length === 0) return { released: 0 };

    await prisma.$transaction(
      tasksToRelease.flatMap((t) => {
        const reward = Number(t.rewardAmount);
        return [
          // Move task VERIFIED → PAID
          prisma.task.update({
            where: { id: t.id },
            data: { status: "PAID", expiresAt: null },
          }),
          // Move pending → available balance
          prisma.wallet.updateMany({
            where: { userId: t.workerId! },
            data: {
              balance: { increment: reward },
              pendingBalance: { decrement: reward },
            },
          }),
          // Mark transaction PENDING → COMPLETED
          prisma.transaction.updateMany({
            where: { referenceId: t.id, referenceType: "task", status: "PENDING" },
            data: { status: "COMPLETED" },
          }),
        ];
      })
    );

    logger.info({ count: tasksToRelease.length }, "Released held payments");
    return { released: tasksToRelease.length };
  }

  // ─── Cron: auto-release expired tasks ────────────────────────────────────
  async releaseExpired() {
    const now = new Date();
    const expired = await prisma.task.findMany({
      where: { status: "ASSIGNED", expiresAt: { lt: now } },
      select: { id: true, workerId: true },
    });

    if (expired.length === 0) return { released: 0 };

    await prisma.$transaction(
      expired.map((t) =>
        prisma.task.update({
          where: { id: t.id },
          data: {
            status: "AVAILABLE",
            workerId: null,
            assignedAt: null,
            expiresAt: null,
            workerEmail: null,
          },
        })
      )
    );

    // Update trust scores for workers who let tasks expire
    const workerIds = [...new Set(expired.map((t) => t.workerId).filter(Boolean))];
    await Promise.all(
      workerIds.map((wid) => this._updateTrustScore(wid!, { expiredDelta: 1 }))
    );

    logger.info({ count: expired.length }, "Released expired tasks");
    return { released: expired.length };
  }

  // ─── Admin: verify or reject proof ───────────────────────────────────────
  async reviewProof(adminId: string, input: ReviewProofInput) {
    const task = await prisma.task.findUnique({
      where: { id: input.taskId },
      include: { proof: true, order: { include: { serviceType: { include: { category: true } } } } },
    });

    if (!task || !task.proof) {
      throw AppError.notFound("TASK_NOT_FOUND", "Task or proof not found");
    }
    // CR-03 fix: status guard BEFORE idempotency check to prevent wrong early-return
    if (task.status !== "SUBMITTED") {
      throw AppError.badRequest("TASK_NOT_SUBMITTED", "Task is not in submitted state");
    }

    // Idempotency: block if a PENDING/COMPLETED reward already exists for this task
    const existingTx = await prisma.transaction.findFirst({
      where: {
        referenceId: input.taskId,
        referenceType: "task",
        type: "REWARD",
        status: { in: ["PENDING", "COMPLETED"] },
      },
    });

    if (existingTx) {
      logger.warn({ taskId: input.taskId }, "Task already rewarded (idempotency)");
      return {
        taskId: input.taskId,
        status: input.status,
        duplicate: true,
      };
    }

    const isApproved = input.status === "VERIFIED";

    await prisma.$transaction(async (tx) => {
      // Update proof status
      await tx.taskProof.update({
        where: { taskId: input.taskId },
        data: {
          status: input.status,
          rejectionReason: input.rejectionReason || null,
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
      });

      if (isApproved) {
        // Calculate hold period based on worker trust
        const trustScore = await tx.trustScore.findUnique({
          where: { userId: task.workerId! }
        });
        const score = trustScore?.score ?? 50;

        // Hold period depends on task type and trust score:
        // - Reviews: 14 days (new), 10 days (mid), 7 days (trusted) — platforms can delete up to 14 days later
        // - Other tasks: 48h (new), 36h (mid), 24h (trusted)
        const isReviewTask = task.order.serviceType.category.slug === "reviews";
        const holdHours = isReviewTask
          ? (score >= 80 ? 7 * 24 : score >= 50 ? 10 * 24 : 14 * 24)
          : (score >= 80 ? 24 : score >= 50 ? 36 : 48);
        const holdUntil = new Date(Date.now() + holdHours * 3600000);

        // Credit worker wallet using dynamic platform fee from order
        const reward = Number(task.rewardAmount);
        const platformFeePct = Number(task.order.platformFeePercent ?? 30) / 100;
        const workerPayout = reward * (1 - platformFeePct);

        const wallet = await tx.wallet.findUnique({ where: { userId: task.workerId! } });
        if (!wallet) {
          throw AppError.badRequest(
            "WALLET_NOT_FOUND",
            `No wallet found for worker ${task.workerId}. Cannot credit reward.`
          );
        }

        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            pendingBalance: { increment: workerPayout },
            totalEarned: { increment: workerPayout },
          },
        });
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: "REWARD",
            amount: workerPayout,
            status: "PENDING",
            description: `Task reward (hold ${holdHours}h)`,
            referenceId: task.id,
            referenceType: "task",
          },
        });

        // Mark task as VERIFIED (not PAID yet — will be PAID after hold expires)
        await tx.task.update({
          where: { id: input.taskId },
          data: {
            status: "VERIFIED",
            verifiedAt: new Date(),
            expiresAt: holdUntil,
          },
        });

        // Increment order completed count
        await tx.order.update({
          where: { id: task.orderId },
          data: { completedQty: { increment: 1 } },
        });
      } else {
        // Rejected: reset to AVAILABLE for another worker
        await tx.task.update({
          where: { id: input.taskId },
          data: {
            status: "AVAILABLE",
            workerId: null,
            assignedAt: null,
            expiresAt: null,
            submittedAt: null,
            workerEmail: null,
          },
        });
      }
    });

    // Update trust score outside transaction (best effort)
    if (task.workerId) {
      await this._updateTrustScore(task.workerId, {
        verifiedDelta: isApproved ? 1 : 0,
        rejectedDelta: isApproved ? 0 : 1,
      });
    }

    publishEvent("task:updated", {
      taskId: input.taskId,
      status: input.status,
      workerId: task.workerId,
    }).catch(() => {});

    return { taskId: input.taskId, status: input.status };
  }

  // ─── Admin: audit queue ──────────────────────────────────────────────────
  // Returns tasks awaiting human review:
  // 1. All SUBMITTED tasks (reviews with screenshots)
  // 2. VERIFIED tasks flagged for 5% random audit (ipAddress='AUDIT')
  async getAuditQueue(page = 1, limit = 20) {
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: {
          OR: [
            { status: "SUBMITTED" },
            { status: "VERIFIED", ipAddress: "AUDIT" },
          ],
        },
        include: {
          proof: true,
          worker: { select: { id: true, email: true, profile: { select: { country: true } } } },
          order: { include: { serviceType: { include: { platform: true, category: true } } } },
        },
        orderBy: { submittedAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({
        where: {
          OR: [
            { status: "SUBMITTED" },
            { status: "VERIFIED", ipAddress: "AUDIT" },
          ],
        },
      }),
    ]);

    return { tasks, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── Worker stats ────────────────────────────────────────────────────────
  async getWorkerStats(workerId: string) {
    const [assigned, submitted, verified, rejected, total, score] = await Promise.all([
      prisma.task.count({ where: { workerId, status: "ASSIGNED" } }),
      prisma.task.count({ where: { workerId, status: "SUBMITTED" } }),
      prisma.task.count({ where: { workerId, status: "PAID" } }),
      prisma.task.count({ where: { workerId, status: "REJECTED" } }),
      prisma.task.count({ where: { workerId } }),
      prisma.trustScore.findUnique({ where: { userId: workerId } }),
    ]);

    const completionRate = total > 0 ? Math.round((verified / total) * 100) : 0;

    return {
      active: assigned,
      submitted,
      completed: verified,
      rejected,
      total,
      completionRate,
      trustScore: score?.score ?? 50,
      level: this._scoreToLevel(score?.score ?? 50),
    };
  }

  // ─── Internal: trust score helper ──────────────────────────────────────
  private async _updateTrustScore(
    workerId: string,
    deltas: { verifiedDelta?: number; rejectedDelta?: number; expiredDelta?: number }
  ) {
    const score = await prisma.trustScore.findUnique({ where: { userId: workerId } });
    const base = score?.score ?? 50;
    const verified = (score?.verifiedTasks ?? 0) + (deltas.verifiedDelta ?? 0);
    const rejected = (score?.rejectedTasks ?? 0) + (deltas.rejectedDelta ?? 0);
    const expired = (score?.flaggedTasks ?? 0) + (deltas.expiredDelta ?? 0);

    let newScore = base;
    newScore += (deltas.verifiedDelta ?? 0) * 5;
    newScore -= (deltas.rejectedDelta ?? 0) * 10;
    newScore -= (deltas.expiredDelta ?? 0) * 20;
    newScore = Math.max(0, Math.min(100, newScore));

    await prisma.trustScore.upsert({
      where: { userId: workerId },
      create: {
        userId: workerId,
        score: newScore,
        totalTasks: verified + rejected + expired,
        verifiedTasks: verified,
        rejectedTasks: rejected,
        flaggedTasks: expired,
      },
      update: {
        score: newScore,
        totalTasks: verified + rejected + expired,
        verifiedTasks: verified,
        rejectedTasks: rejected,
        flaggedTasks: expired,
        lastCalculated: new Date(),
      },
    });
  }

  private _scoreToLevel(score: number): string {
    if (score >= 80) return "gold";
    if (score >= 50) return "silver";
    if (score >= 30) return "bronze";
    return "new";
  }
}
