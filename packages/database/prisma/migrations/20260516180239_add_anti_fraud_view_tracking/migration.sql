-- AlterTable
ALTER TABLE "service_types" ADD COLUMN     "minViewDuration" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "requiresTimer" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "worker_view_history" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,

    CONSTRAINT "worker_view_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "worker_view_history_taskId_key" ON "worker_view_history"("taskId");

-- CreateIndex
CREATE INDEX "worker_view_history_workerId_idx" ON "worker_view_history"("workerId");

-- CreateIndex
CREATE INDEX "worker_view_history_targetUrl_idx" ON "worker_view_history"("targetUrl");

-- CreateIndex
CREATE INDEX "worker_view_history_orderId_idx" ON "worker_view_history"("orderId");

-- CreateIndex
CREATE INDEX "worker_view_history_ipAddress_idx" ON "worker_view_history"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "worker_view_history_workerId_targetUrl_key" ON "worker_view_history"("workerId", "targetUrl");

-- AddForeignKey
ALTER TABLE "worker_view_history" ADD CONSTRAINT "worker_view_history_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_view_history" ADD CONSTRAINT "worker_view_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_view_history" ADD CONSTRAINT "worker_view_history_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
