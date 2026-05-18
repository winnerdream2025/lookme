/*
  Warnings:

  - A unique constraint covering the columns `[deviceFingerprint,targetUrl]` on the table `worker_email_usages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "deviceFingerprint" TEXT;

-- AlterTable
ALTER TABLE "worker_email_usages" ADD COLUMN     "deviceFingerprint" TEXT,
ADD COLUMN     "ipAddress" TEXT;

-- CreateIndex
CREATE INDEX "worker_email_usages_deviceFingerprint_idx" ON "worker_email_usages"("deviceFingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "worker_email_usages_deviceFingerprint_targetUrl_key" ON "worker_email_usages"("deviceFingerprint", "targetUrl");
