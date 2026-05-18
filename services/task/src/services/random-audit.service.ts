import { prisma } from '@lookme/database';
import { TrustScoreService } from './trust-score.service';
import { createLogger } from '@lookme/logger';

const logger = createLogger('random-audit-service');

/**
 * 5% Random Quality Control Audit System
 * 
 * TIER 2: You cannot check 10,000 tasks, but you can check 500 random ones
 * 
 * - 95% of tasks are auto-approved
 * - 5% are randomly sent to Admin Audit Queue
 * - If worker is caught with fake screenshot ONCE → INSTANT BAN + FORFEIT ALL PENDING
 * 
 * Fear of the system keeps workers honest!
 */

export class RandomAuditService {
  /**
   * Determine if task should go to random audit
   * Returns true 5% of the time
   */
  static shouldAudit(): boolean {
    return Math.random() < 0.05; // 5% chance
  }

  /**
   * Submit task for auto-approval or random audit
   */
  static async submitTaskForReview(
    taskId: string,
    workerId: string,
    isFollowersTask: boolean = false
  ): Promise<{ autoApproved: boolean; requiresAudit: boolean }> {
    // Followers/Likes tasks: 95% auto-approved, 5% random audit
    if (isFollowersTask) {
      const requiresAudit = this.shouldAudit();

      if (requiresAudit) {
        // Send to admin audit queue
        await prisma.task.update({
          where: { id: taskId },
          data: {
            status: 'SUBMITTED', // Admin must review
          },
        });

        logger.info({ taskId, workerId }, 'Task selected for 5% random audit');

        return { autoApproved: false, requiresAudit: true };
      } else {
        // Auto-approve (95% of tasks)
        await prisma.task.update({
          where: { id: taskId },
          data: {
            status: 'VERIFIED',
          },
        });

        logger.info({ taskId }, 'Task auto-approved (95% path)');

        return { autoApproved: true, requiresAudit: false };
      }
    }

    // Other task types: normal review process
    return { autoApproved: false, requiresAudit: false };
  }

  /**
   * Admin approves a task from audit queue
   */
  static async approveAuditedTask(
    taskId: string,
    adminId: string
  ): Promise<void> {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'VERIFIED',
      },
    });

    logger.info({ taskId, adminId }, 'Admin approved audited task');
  }

  /**
   * Admin rejects a task from audit queue (FRAUD DETECTED)
   * INSTANT BAN + FORFEIT ALL PENDING BALANCE
   */
  static async rejectAuditedTask(
    taskId: string,
    workerId: string,
    adminId: string,
    reason: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Reject the task
      await tx.task.update({
        where: { id: taskId },
        data: {
          status: 'REJECTED',
        },
      });

      // INSTANT BAN + FORFEIT PENDING BALANCE
      await TrustScoreService.penalizeFailedAudit(workerId, taskId, reason);

      logger.warn({ taskId, workerId, adminId, reason }, 'Admin rejected audited task — worker banned');
    });
  }

  /**
   * Get random audit queue for admin
   */
  static async getAuditQueue(limit: number = 50) {
    const tasks = await prisma.task.findMany({
      where: {
        status: 'SUBMITTED',
      },
      include: {
        worker: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        order: {
          include: {
            serviceType: {
              include: {
                platform: true,
                category: true,
              },
            },
          },
        },
        proof: true,
      },
      orderBy: { submittedAt: 'asc' },
      take: limit,
    });

    return tasks.map((task) => ({
      taskId: task.id,
      workerId: task.workerId,
      workerEmail: task.worker?.email,
      workerName: task.worker?.profile
        ? `${task.worker.profile.firstName || ''} ${task.worker.profile.lastName || ''}`.trim()
        : 'Unknown',
      platform: task.order.serviceType.platform.name,
      category: task.order.serviceType.category.name,
      targetUrl: task.targetUrl,
      submittedAt: task.submittedAt,
      proof: task.proof || null,
    }));
  }

  /**
   * Get audit statistics
   */
  static async getAuditStats() {
    const [totalAudited, approved, rejected, pending] = await Promise.all([
      prisma.task.count({
        where: {
          status: { in: ['VERIFIED', 'REJECTED', 'SUBMITTED'] },
        },
      }),
      prisma.task.count({
        where: { status: 'VERIFIED' },
      }),
      prisma.task.count({
        where: { status: 'REJECTED' },
      }),
      prisma.task.count({
        where: { status: 'SUBMITTED' },
      }),
    ]);

    const approvalRate = totalAudited > 0 ? (approved / totalAudited) * 100 : 0;
    const rejectionRate = totalAudited > 0 ? (rejected / totalAudited) * 100 : 0;

    return {
      totalAudited,
      approved,
      rejected,
      pending,
      approvalRate: Math.round(approvalRate * 10) / 10,
      rejectionRate: Math.round(rejectionRate * 10) / 10,
    };
  }
}
