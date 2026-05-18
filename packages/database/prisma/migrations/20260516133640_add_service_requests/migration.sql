-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM ('NEW', 'TRIAGED', 'PROPOSED', 'WON', 'CLOSED');

-- CreateTable
CREATE TABLE "service_requests" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "projectName" TEXT NOT NULL,
    "platformName" TEXT NOT NULL,
    "platformUrl" TEXT,
    "requestedAction" TEXT NOT NULL,
    "quantity" TEXT,
    "deadline" TEXT,
    "region" TEXT,
    "genderPref" "Gender",
    "budgetRange" TEXT,
    "contactMethod" TEXT NOT NULL,
    "contactHandle" TEXT,
    "notes" TEXT,
    "status" "ServiceRequestStatus" NOT NULL DEFAULT 'NEW',
    "source" TEXT,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_requests_clientId_idx" ON "service_requests"("clientId");

-- CreateIndex
CREATE INDEX "service_requests_status_idx" ON "service_requests"("status");

-- CreateIndex
CREATE INDEX "service_requests_createdAt_idx" ON "service_requests"("createdAt");

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
