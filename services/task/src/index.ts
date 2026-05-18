import { createApp } from "@lookme/server";
import { config } from "@lookme/config";
import { createLogger } from "@lookme/logger";
import { taskRoutes } from "./routes/task.routes";
import { prisma } from "@lookme/database";
import cron from "node-cron";

const logger = createLogger("task-service");

const app = createApp({
  serviceName: "task-service",
  routes: [{ path: "/", router: taskRoutes }],
});

const port = config.ports.task;

// Cron job: Release expired holds every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  try {
    const now = new Date();
    const expired = await prisma.task.findMany({
      where: {
        status: "VERIFIED",
        expiresAt: { lt: now }
      },
      include: { worker: { include: { wallet: true } } }
    });

    if (expired.length === 0) {
      logger.debug("No holds to release");
      return;
    }

    for (const task of expired) {
      if (!task.worker?.wallet) continue;

      const pendingTx = await prisma.transaction.findFirst({
        where: {
          referenceId: task.id,
          referenceType: "task",
          status: "PENDING"
        }
      });

      if (!pendingTx) continue;

      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: task.worker.wallet.id },
          data: {
            pendingBalance: { decrement: Number(pendingTx.amount) },
            balance: { increment: Number(pendingTx.amount) }
          }
        }),
        prisma.transaction.update({
          where: { id: pendingTx.id },
          data: { status: "COMPLETED", description: `${pendingTx.description} - Released` }
        }),
        prisma.task.update({
          where: { id: task.id },
          data: { status: "PAID" }
        })
      ]);
    }

    logger.info({ released: expired.length }, "Released expired holds");
  } catch (err) {
    logger.error({ error: err }, "Failed to release holds");
  }
});

app.listen(port, () => {
  logger.info(`Task service running on port ${port}`);
});
