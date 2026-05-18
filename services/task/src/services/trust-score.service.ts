import { prisma } from '@lookme/database';
import { AppError } from '@lookme/server';
import { createLogger } from '@lookme/logger';

const logger = createLogger('trust-score-service');

/**
 * Trust Score & Penalty System
 * 
 * Every worker starts with Trust Score = 100
 * 
 * Penalties:
 * - Failed Random Audit: Score = 0 (INSTANT BAN, WALLET FORFEITED)
 * - Bot Detection (too fast): Score -= 10
 * - Unfollowed Later: Score -= 30 (blocked from high-paying tasks)
 * - Multiple Violations: Progressive penalties
 */

export class TrustScoreService {
  /**
   * Initialize trust score for new worker
   */
  static async initializeTrustScore(userId: string): Promise<void> {
    await prisma.trustScore.upsert({
      where: { userId },
      create: {
        userId,
        score: 100, // Everyone starts at 100
        totalTasks: 0,
        verifiedTasks: 0,
        rejectedTasks: 0,
        flaggedTasks: 0,
        fraudFlags: 0,
        avgCompletionTime: 0,
        lastCalculated: new Date(),
      },
      update: {},
    });
  }

  /**
   * TIER 1: Failed Random Audit
   * INSTANT BAN + FORFEIT ALL PENDING EARNINGS
   */
  static async penalizeFailedAudit(
    userId: string,
    taskId: string,
    reason: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Set trust score to 0 (instant ban)
      await tx.trustScore.update({
        where: { userId },
        data: {
          score: 0,
          fraudFlags: { increment: 1 },
          lastCalculated: new Date(),
        },
      });

      // Ban the user account
      await tx.user.update({
        where: { id: userId },
        data: { isActive: false },
      });

      // Forfeit ALL pending balance
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (wallet && Number(wallet.pendingBalance) > 0) {
        await tx.wallet.update({
          where: { userId },
          data: {
            pendingBalance: 0, // WIPED OUT!
          },
        });

        // Log the forfeiture
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'PLATFORM_FEE',
            amount: -Number(wallet.pendingBalance),
            status: 'COMPLETED',
            referenceId: taskId,
            referenceType: 'task',
            description: `Pending balance forfeited due to failed audit: ${reason}`,
          },
        });
      }

      logger.warn({ userId, taskId, reason }, 'INSTANT BAN: failed audit — trust score = 0, pending balance forfeited');
    });
  }

  /**
   * TIER 2: Bot Detection (Task completed too fast)
   * Penalty: -10 Trust Score
   */
  static async penalizeBotDetection(
    userId: string,
    taskId: string,
    completionTime: number
  ): Promise<void> {
    const trustScore = await prisma.trustScore.findUnique({
      where: { userId },
    });

    if (!trustScore) return;

    const newScore = Math.max(0, trustScore.score - 10);

    await prisma.trustScore.update({
      where: { userId },
      data: {
        score: newScore,
        fraudFlags: { increment: 1 },
        flaggedTasks: { increment: 1 },
        lastCalculated: new Date(),
      },
    });

    // If score drops below 50, suspend account temporarily
    if (newScore < 50) {
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
      });
    }

    logger.warn({ userId, taskId, completionTime, oldScore: trustScore.score, newScore }, 'Bot detected — trust score penalised');
  }

  /**
   * TIER 3: Unfollow Detection
   * Penalty: -30 Trust Score + Block from high-paying tasks
   */
  static async penalizeUnfollow(
    userId: string,
    taskId: string
  ): Promise<void> {
    const trustScore = await prisma.trustScore.findUnique({
      where: { userId },
    });

    if (!trustScore) return;

    const newScore = Math.max(0, trustScore.score - 30);

    await prisma.trustScore.update({
      where: { userId },
      data: {
        score: newScore,
        fraudFlags: { increment: 1 },
        lastCalculated: new Date(),
      },
    });

    logger.warn({ userId, taskId, oldScore: trustScore.score, newScore }, 'Unfollow detected — trust score penalised');
  }

  /**
   * Check if worker is eligible for task based on trust score
   */
  static async canAcceptTask(
    userId: string,
    taskType: string,
    rewardAmount: number
  ): Promise<{ allowed: boolean; reason?: string }> {
    const trustScore = await prisma.trustScore.findUnique({
      where: { userId },
    });

    if (!trustScore) {
      return { allowed: false, reason: 'Trust score not found' };
    }

    // Banned workers (score = 0) cannot accept any tasks
    if (trustScore.score === 0) {
      return { allowed: false, reason: 'Account banned due to fraud' };
    }

    // Low trust workers (score < 50) cannot accept high-paying tasks
    if (trustScore.score < 50 && rewardAmount > 1.0) {
      return {
        allowed: false,
        reason: 'Trust score too low for high-paying tasks. Complete more tasks to rebuild trust.',
      };
    }

    // Workers with score < 30 can only do basic tasks
    if (trustScore.score < 30 && taskType === 'reviews') {
      return {
        allowed: false,
        reason: 'Trust score too low for review tasks. Focus on simple tasks to rebuild trust.',
      };
    }

    return { allowed: true };
  }

  /**
   * Increment trust score for successful task completion
   */
  static async rewardSuccessfulTask(userId: string): Promise<void> {
    const trustScore = await prisma.trustScore.findUnique({
      where: { userId },
    });

    if (!trustScore) return;

    // Gradually rebuild trust (max 100)
    const newScore = Math.min(100, trustScore.score + 1);

    await prisma.trustScore.update({
      where: { userId },
      data: {
        score: newScore,
        verifiedTasks: { increment: 1 },
        totalTasks: { increment: 1 },
        lastCalculated: new Date(),
      },
    });
  }

  /**
   * Get trust score summary for worker
   */
  static async getTrustScoreSummary(userId: string) {
    const trustScore = await prisma.trustScore.findUnique({
      where: { userId },
    });

    if (!trustScore) {
      throw AppError.notFound('TRUST_SCORE_NOT_FOUND', 'Trust score not found');
    }

    return {
      score: trustScore.score,
      status: this.getTrustStatus(trustScore.score),
      totalTasks: trustScore.totalTasks,
      verifiedTasks: trustScore.verifiedTasks,
      rejectedTasks: trustScore.rejectedTasks,
      fraudFlags: trustScore.fraudFlags,
      canAcceptHighPayingTasks: trustScore.score >= 50,
      canAcceptReviewTasks: trustScore.score >= 30,
    };
  }

  /**
   * Get trust status label
   */
  private static getTrustStatus(score: number): string {
    if (score === 0) return 'BANNED';
    if (score < 30) return 'VERY_LOW';
    if (score < 50) return 'LOW';
    if (score < 70) return 'MEDIUM';
    if (score < 90) return 'GOOD';
    return 'EXCELLENT';
  }
}
