import { prisma } from '@lookme/database';
import { createLogger } from '@lookme/logger';

const logger = createLogger('pending-balance-service');

/**
 * 24-Hour Pending Balance Hold System
 * 
 * TIER 1: Money is instantly approved but held for 24 hours
 * - Workers can SEE the money in their pending balance
 * - Workers CANNOT withdraw it for 24 hours
 * - This ruins the incentive for bots/scammers who want to drain and run
 * 
 * After 24 hours, pending balance automatically moves to available balance
 */

export class PendingBalanceService {
  /**
   * Add earnings to pending balance (24-hour hold)
   */
  static async addToPendingBalance(
    userId: string,
    amount: number,
    taskId: string,
    description: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { userId },
        data: {
          pendingBalance: { increment: amount },
          totalEarned: { increment: amount },
        },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'REWARD',
          amount,
          status: 'PENDING',
          referenceId: taskId,
          referenceType: 'task',
          description: `${description} (24-hour hold)`,
        },
      });

      logger.info({ userId, amount }, 'Added to pending balance — available after 24 hours');
    });
  }

  /**
   * Release pending balance after 24 hours
   * Run this as a cron job every hour
   */
  static async releasePendingBalances(): Promise<void> {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Find all pending transactions older than 24 hours
    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        status: 'PENDING',
        type: 'REWARD',
        createdAt: { lte: twentyFourHoursAgo },
      },
    });

    logger.info({ count: pendingTransactions.length }, 'Releasing pending balances');

    for (const transaction of pendingTransactions) {
      await prisma.$transaction(async (tx) => {
        await tx.wallet.update({
          where: { id: transaction.walletId },
          data: {
            balance: { increment: transaction.amount },
            pendingBalance: { decrement: transaction.amount },
          },
        });

        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: 'COMPLETED' },
        });

        logger.info({ amount: Number(transaction.amount), walletId: transaction.walletId }, 'Pending balance released');
      });
    }
  }

  /**
   * Get wallet summary with pending balance info
   */
  static async getWalletSummary(userId: string) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Calculate when pending balance will be available
    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        wallet: { userId },
        status: 'PENDING',
        type: 'REWARD',
      },
      orderBy: { createdAt: 'asc' },
    });

    const first = pendingTransactions[0];
    const nextRelease = first
      ? new Date(first.createdAt.getTime() + 24 * 60 * 60 * 1000)
      : null;

    return {
      availableBalance: wallet.balance,
      pendingBalance: wallet.pendingBalance,
      totalEarned: wallet.totalEarned,
      canWithdraw: Number(wallet.balance) >= 5.0, // Minimum $5
      nextReleaseAt: nextRelease,
      pendingTransactionsCount: pendingTransactions.length,
    };
  }
}
