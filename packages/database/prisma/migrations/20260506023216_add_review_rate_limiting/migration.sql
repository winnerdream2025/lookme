-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "dailyLimit" INTEGER;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "scheduledFor" TIMESTAMP(3),
ADD COLUMN     "workerEmail" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "termsAcceptedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "worker_email_usages" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "worker_email_usages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "worker_email_usages_taskId_key" ON "worker_email_usages"("taskId");

-- CreateIndex
CREATE INDEX "worker_email_usages_workerId_idx" ON "worker_email_usages"("workerId");

-- CreateIndex
CREATE INDEX "worker_email_usages_targetUrl_idx" ON "worker_email_usages"("targetUrl");

-- CreateIndex
CREATE UNIQUE INDEX "worker_email_usages_email_targetUrl_key" ON "worker_email_usages"("email", "targetUrl");

-- CreateIndex
CREATE UNIQUE INDEX "worker_email_usages_workerId_orderId_key" ON "worker_email_usages"("workerId", "orderId");

-- CreateIndex
CREATE INDEX "tasks_scheduledFor_idx" ON "tasks"("scheduledFor");

-- AddForeignKey
ALTER TABLE "worker_email_usages" ADD CONSTRAINT "worker_email_usages_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_email_usages" ADD CONSTRAINT "worker_email_usages_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_email_usages" ADD CONSTRAINT "worker_email_usages_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
