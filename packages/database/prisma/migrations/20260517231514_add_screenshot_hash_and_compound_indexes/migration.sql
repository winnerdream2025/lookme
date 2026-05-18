-- AlterTable
ALTER TABLE "task_proofs" ADD COLUMN     "screenshotHash" TEXT;

-- CreateIndex
CREATE INDEX "task_proofs_screenshotHash_idx" ON "task_proofs"("screenshotHash");

-- CreateIndex
CREATE INDEX "tasks_status_workerId_idx" ON "tasks"("status", "workerId");

-- CreateIndex
CREATE INDEX "tasks_status_expiresAt_idx" ON "tasks"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "tasks_status_scheduledFor_idx" ON "tasks"("status", "scheduledFor");
