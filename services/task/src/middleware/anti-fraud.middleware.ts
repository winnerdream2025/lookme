import { Request, Response, NextFunction } from 'express';
import { prisma } from '@lookme/database';
import { AppError } from '@lookme/server';
import { createLogger } from '@lookme/logger';

const logger = createLogger('anti-fraud-middleware');

/**
 * Universal Anti-Fraud Middleware
 * 
 * Applies to ALL services automatically based on category:
 * - Traffic/View tasks: URL-based protection (1 Worker = 1 View per URL)
 * - Review tasks: Email + Device + URL protection (3-layer)
 */

interface AntiFraudRequest extends Request {
  body: {
    taskId: string;
    workerEmail?: string;
    deviceFingerprint?: string;
  };
}

/**
 * Check if worker has already interacted with this URL
 * Works for ALL view/traffic services (YouTube, TikTok, Instagram, Website, etc.)
 */
async function checkUrlAntifraud(
  workerId: string,
  targetUrl: string,
  categorySlug: string
): Promise<void> {
  // Check if worker has already viewed this URL
  const alreadyViewed = await prisma.workerViewHistory.findUnique({
    where: {
      workerId_targetUrl: {
        workerId,
        targetUrl,
      },
    },
  });

  if (alreadyViewed) {
    throw AppError.badRequest(
      'URL_ALREADY_VIEWED',
      `You have already viewed this ${getCategoryDisplayName(categorySlug)}. Each worker can only view a unique URL once to prevent spam detection.`
    );
  }
}

/**
 * Check if email has already been used for this business
 * Works for ALL review services (Google, Yelp, Facebook, Trustpilot, etc.)
 */
async function checkEmailAntifraud(
  email: string,
  targetUrl: string,
  categorySlug: string
): Promise<void> {
  const emailUsed = await prisma.workerEmailUsage.findUnique({
    where: {
      email_targetUrl: {
        email,
        targetUrl,
      },
    },
  });

  if (emailUsed) {
    throw AppError.badRequest(
      'EMAIL_ALREADY_USED',
      `The email ${email} has already been used to review this business on ${getCategoryDisplayName(categorySlug)}. Please use a different account.`
    );
  }
}

/**
 * Check if device has already been used for this business
 * CRITICAL: Prevents worker from using 5 different accounts on same phone
 * Works for ALL review services
 */
async function checkDeviceAntifraud(
  deviceFingerprint: string,
  targetUrl: string,
  categorySlug: string
): Promise<void> {
  const deviceUsed = await prisma.workerEmailUsage.findUnique({
    where: {
      deviceFingerprint_targetUrl: {
        deviceFingerprint,
        targetUrl,
      },
    },
  });

  if (deviceUsed) {
    throw AppError.badRequest(
      'DEVICE_ALREADY_USED',
      `This device has already been used to review this business on ${getCategoryDisplayName(categorySlug)}. ` +
      `${getCategoryDisplayName(categorySlug)} tracks device hardware IDs and will delete duplicate reviews from the same device. ` +
      `Please use a different physical device (phone or tablet).`
    );
  }
}

/**
 * Check if worker has already done a task for this order
 * Prevents same worker from claiming multiple tasks from same order
 */
async function checkWorkerOrderAntifraud(
  workerId: string,
  orderId: string
): Promise<void> {
  const alreadyDidOrder = await prisma.workerEmailUsage.findUnique({
    where: {
      workerId_orderId: {
        workerId,
        orderId,
      },
    },
  });

  if (alreadyDidOrder) {
    throw AppError.badRequest(
      'ALREADY_REVIEWED_ORDER',
      'You have already submitted a review for this business in this order. Each worker may only post one review per business.'
    );
  }
}

/**
 * Get user-friendly category name for error messages
 */
function getCategoryDisplayName(categorySlug: string): string {
  const displayNames: Record<string, string> = {
    'views': 'video',
    'traffic': 'website',
    'visits': 'page',
    'reviews': 'platform',
    'followers': 'account',
    'likes': 'post',
    'subscribers': 'channel',
    'streams': 'track',
  };
  return displayNames[categorySlug] || 'content';
}

/**
 * Main Anti-Fraud Middleware
 * Automatically applies appropriate checks based on service category
 */
export async function antiFraudMiddleware(
  req: AntiFraudRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workerId = req.headers['x-user-id'] as string;
    const { taskId, workerEmail, deviceFingerprint } = req.body;

    if (!workerId || !taskId) {
      return next();
    }

    // Fetch task with service type and category
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        order: {
          include: {
            serviceType: {
              include: {
                category: true,
                platform: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw AppError.notFound('TASK_NOT_FOUND', 'Task not found');
    }

    const categorySlug = task.order.serviceType.category.slug;
    const targetUrl = task.targetUrl;
    const orderId = task.orderId;

    // Determine service type
    const isTrafficTask = ['views', 'traffic', 'visits', 'streams'].includes(categorySlug);
    const isReviewTask = categorySlug === 'reviews';
    const isFollowersTask = ['followers', 'likes', 'subscribers'].includes(categorySlug);

    // ============================================================
    // TRAFFIC/VIEW TASKS (YouTube, TikTok, Instagram, Website, Spotify)
    // ============================================================
    if (isTrafficTask) {
      // GOLDEN RULE: 1 Worker = 1 View per URL
      await checkUrlAntifraud(workerId, targetUrl, categorySlug);
      
      logger.info({ taskId: task.id, categorySlug }, 'Anti-fraud passed');
    }

    // ============================================================
    // REVIEW TASKS (Google, Yelp, Facebook, Trustpilot, etc.)
    // ============================================================
    else if (isReviewTask) {
      // Layer 1: Email validation
      if (!workerEmail) {
        throw AppError.badRequest(
          'EMAIL_REQUIRED',
          'You must provide the email account you will use to post this review'
        );
      }

      // Layer 2: Device validation (CRITICAL!)
      if (!deviceFingerprint) {
        throw AppError.badRequest(
          'DEVICE_FINGERPRINT_REQUIRED',
          'Device fingerprint is required for review tasks to prevent fraud'
        );
      }

      // Check all 3 layers
      await checkEmailAntifraud(workerEmail, targetUrl, categorySlug);
      await checkDeviceAntifraud(deviceFingerprint, targetUrl, categorySlug);
      await checkWorkerOrderAntifraud(workerId, orderId);

      logger.info({ taskId: task.id }, 'Anti-fraud passed — 3-layer review check');
    }

    // ============================================================
    // FOLLOWERS/LIKES TASKS (Instagram, Twitter, TikTok, etc.)
    // ============================================================
    else if (isFollowersTask) {
      // URL-based protection (same as traffic tasks)
      await checkUrlAntifraud(workerId, targetUrl, categorySlug);
      
      logger.info({ taskId: task.id, categorySlug }, 'Anti-fraud passed');
    }

    // Store task info in request for later use
    (req as any).antiFraudTask = task;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Helper function to record view history after task completion
 * Call this from submitProof for traffic tasks
 */
export async function recordViewHistory(
  workerId: string,
  taskId: string,
  targetUrl: string,
  orderId: string,
  ipAddress: string,
  userAgent?: string,
  duration?: number
): Promise<void> {
  await prisma.workerViewHistory.create({
    data: {
      workerId,
      targetUrl,
      orderId,
      taskId,
      ipAddress,
      userAgent: userAgent || null,
      duration: duration || null,
    },
  });
}

/**
 * Helper function to record email/device usage after review task completion
 * Call this from submitProof for review tasks
 */
export async function recordEmailDeviceUsage(
  workerId: string,
  email: string,
  targetUrl: string,
  orderId: string,
  taskId: string,
  deviceFingerprint?: string,
  ipAddress?: string
): Promise<void> {
  await prisma.workerEmailUsage.create({
    data: {
      workerId,
      email,
      targetUrl,
      orderId,
      taskId,
      deviceFingerprint: deviceFingerprint || null,
      ipAddress: ipAddress || null,
    },
  });
}
