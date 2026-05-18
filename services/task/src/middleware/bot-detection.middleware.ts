import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AppError } from '@lookme/server';
import { prisma } from '@lookme/database';
import { TrustScoreService } from '../services/trust-score.service';
import { createLogger } from '@lookme/logger';

const logger = createLogger('bot-detection-middleware');

/**
 * Bot Detection & Screenshot Validation Middleware
 *
 * Blocks automated bots and fake submissions:
 * 1. Action Timer: Uses DB task.assignedAt (persistent, multi-instance safe)
 * 2. Screenshot File Size: Rejects files < 50 KB
 * 3. Duplicate Hash Detection: SHA-256 checked against DB (not in-memory)
 * 4. Empty File Detection: Rejects 0-byte files
 */

interface BotDetectionRequest extends Request {
  body: {
    taskId: string;
    screenshotUrl?: string;
    proofUrl?: string;
  };
  file?: Express.Multer.File;
}

/**
 * No-op: assignedAt is written to DB by acceptTask — no in-memory record needed.
 * Kept for backward compatibility with task.service.v2.ts imports.
 */
export function recordTaskAcceptance(_taskId: string): void {}

/**
 * Check if task was completed too fast (bot detection).
 * SOURCE OF TRUTH: task.assignedAt in DB — survives restarts and scales horizontally.
 */
async function checkActionTimer(taskId: string, userId: string): Promise<void> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { assignedAt: true },
  });

  if (!task?.assignedAt) return; // task not yet assigned or old task — allow

  const elapsedSeconds = (Date.now() - task.assignedAt.getTime()) / 1000;
  const MIN_COMPLETION_TIME = 15;

  if (elapsedSeconds < MIN_COMPLETION_TIME) {
    await TrustScoreService.penalizeBotDetection(userId, taskId, elapsedSeconds);
    throw AppError.badRequest(
      'BOT_DETECTED',
      `Task completed too fast (${Math.round(elapsedSeconds)}s). Minimum time is ${MIN_COMPLETION_TIME}s. ` +
      `Your trust score has been reduced by 10 points. Repeated violations will result in account suspension.`
    );
  }
}

/**
 * Validate screenshot file
 */
async function validateScreenshot(
  file: Express.Multer.File | undefined,
  taskId: string,
  userId: string
): Promise<string | null> {
  if (!file) {
    return null; // No file uploaded (might be URL-based proof)
  }

  // CHECK 1: File size must be at least 50 KB
  const MIN_FILE_SIZE = 50 * 1024; // 50 KB
  
  if (file.size < MIN_FILE_SIZE) {
    throw AppError.badRequest(
      'INVALID_SCREENSHOT',
      `Screenshot file is too small (${Math.round(file.size / 1024)} KB). ` +
      `Minimum size is 50 KB. Bots often upload empty or tiny files. ` +
      `Please upload a real screenshot.`
    );
  }

  // CHECK 2: File size must not be 0 bytes
  if (file.size === 0) {
    throw AppError.badRequest(
      'EMPTY_FILE',
      'Screenshot file is empty (0 bytes). Please upload a valid screenshot.'
    );
  }

  // CHECK 3: Calculate file hash and check against DB for persistent duplicate detection
  // In-memory Map was bypassed by server restart — DB is the only reliable source of truth
  const fileHash = crypto
    .createHash('sha256')
    .update(file.buffer)
    .digest('hex');

  const existingProof = await prisma.taskProof.findFirst({
    where: { screenshotHash: fileHash, taskId: { not: taskId } },
    select: { taskId: true },
  });

  if (existingProof) {
    throw AppError.badRequest(
      'DUPLICATE_SCREENSHOT',
      'This screenshot has already been uploaded by another worker. ' +
      'Each worker must upload their own unique screenshot. ' +
      'Copying screenshots from other workers is fraud and will result in account suspension.'
    );
  }

  logger.info({ size: file.size, hashPrefix: fileHash.substring(0, 16) }, 'Screenshot validated');
  return fileHash;
}

/**
 * Main Bot Detection Middleware
 */
export async function botDetectionMiddleware(
  req: BotDetectionRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req.headers['x-user-id'] as string) || "";
    const { taskId } = req.body;
    const file = req.file;

    if (!userId || !taskId) {
      return next();
    }

    // Check action timer (task completed too fast?)
    await checkActionTimer(taskId, userId);

    // Validate screenshot if provided; attach hash to req for persistence
    const screenshotHash = await validateScreenshot(file, taskId, userId);
    if (screenshotHash) {
      (req as any).screenshotHash = screenshotHash;
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * No-op: kept for backward compatibility. DB-backed detection has no in-memory state to clean.
 */
export function cleanupOldTimestamps(): void {}
