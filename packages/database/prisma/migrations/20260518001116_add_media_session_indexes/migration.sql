-- CreateTable
CREATE TABLE "media_sessions" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastHeartbeatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeSeconds" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_sessions_taskId_key" ON "media_sessions"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "media_sessions_token_key" ON "media_sessions"("token");

-- CreateIndex
CREATE INDEX "media_sessions_workerId_idx" ON "media_sessions"("workerId");

-- CreateIndex
CREATE INDEX "media_sessions_token_idx" ON "media_sessions"("token");

-- CreateIndex
CREATE INDEX "media_sessions_status_lastHeartbeatAt_idx" ON "media_sessions"("status", "lastHeartbeatAt");

-- CreateIndex
CREATE INDEX "task_proofs_screenshotHash_status_idx" ON "task_proofs"("screenshotHash", "status");

-- CreateIndex
CREATE INDEX "tasks_workerId_status_idx" ON "tasks"("workerId", "status");

-- CreateIndex
CREATE INDEX "tasks_status_assignedAt_idx" ON "tasks"("status", "assignedAt");

-- CreateIndex
CREATE INDEX "worker_view_history_ipAddress_targetUrl_idx" ON "worker_view_history"("ipAddress", "targetUrl");

-- CreateIndex
CREATE INDEX "worker_view_history_viewedAt_idx" ON "worker_view_history"("viewedAt");

-- AddForeignKey
ALTER TABLE "media_sessions" ADD CONSTRAINT "media_sessions_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
