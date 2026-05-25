/*
  Warnings:

  - You are about to drop the column `month` on the `MonthlyPayment` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `MonthlyPayment` table. All the data in the column will be lost.
  - You are about to drop the column `paidTillMonth` on the `Musulli` table. All the data in the column will be lost.
  - You are about to drop the column `paidTillYear` on the `Musulli` table. All the data in the column will be lost.
  - You are about to drop the column `startMonth` on the `Musulli` table. All the data in the column will be lost.
  - You are about to drop the column `startYear` on the `Musulli` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[musulliId,billingMonth]` on the table `MonthlyPayment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `billingMonth` to the `MonthlyPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joinedAt` to the `Musulli` table without a default value. This is not possible if the table is not empty.
  - Made the column `musulliId` on table `PaymentLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PaymentLog" DROP CONSTRAINT "PaymentLog_musulliId_fkey";

-- DropIndex
DROP INDEX "MonthlyPayment_musulliId_month_year_key";

-- AlterTable
ALTER TABLE "MonthlyPayment" DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "billingMonth" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Musulli" DROP COLUMN "paidTillMonth",
DROP COLUMN "paidTillYear",
DROP COLUMN "startMonth",
DROP COLUMN "startYear",
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "paidTill" TIMESTAMP(3),
ALTER COLUMN "phone" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PaymentLog" ALTER COLUMN "paymentDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "musulliId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "MonthlyPayment_billingMonth_idx" ON "MonthlyPayment"("billingMonth");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyPayment_musulliId_billingMonth_key" ON "MonthlyPayment"("musulliId", "billingMonth");

-- CreateIndex
CREATE INDEX "PaymentLog_musulliId_idx" ON "PaymentLog"("musulliId");

-- AddForeignKey
ALTER TABLE "PaymentLog" ADD CONSTRAINT "PaymentLog_musulliId_fkey" FOREIGN KEY ("musulliId") REFERENCES "Musulli"("id") ON DELETE CASCADE ON UPDATE CASCADE;
