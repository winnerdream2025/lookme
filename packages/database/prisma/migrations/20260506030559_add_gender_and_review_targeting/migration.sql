-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'ANY');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "businessCountry" CHAR(2),
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "requiredGender" "Gender";

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "gender" "Gender";
