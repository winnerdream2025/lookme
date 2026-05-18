/*
  Warnings:

  - You are about to drop the `service_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "service_requests" DROP CONSTRAINT "service_requests_clientId_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "platformFeePercent" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "service_types" ADD COLUMN     "platformFeePercent" INTEGER NOT NULL DEFAULT 30;

-- DropTable
DROP TABLE "service_requests";

-- DropEnum
DROP TYPE "ServiceRequestStatus";
