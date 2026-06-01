/*
  Warnings:

  - You are about to drop the column `paidTill` on the `Musulli` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDue` on the `Musulli` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyPaymentId` on the `PaymentLog` table. All the data in the column will be lost.
  - You are about to drop the `MonthlyPayment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `paidMonth` to the `PaymentLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MonthlyPayment" DROP CONSTRAINT "MonthlyPayment_musulliId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentLog" DROP CONSTRAINT "PaymentLog_monthlyPaymentId_fkey";

-- DropIndex
DROP INDEX "PaymentLog_monthlyPaymentId_idx";

-- AlterTable
ALTER TABLE "Musulli" DROP COLUMN "paidTill",
DROP COLUMN "paymentDue",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PaymentLog" DROP COLUMN "monthlyPaymentId",
ADD COLUMN     "paidMonth" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "MonthlyPayment";

-- CreateIndex
CREATE INDEX "PaymentLog_paidMonth_idx" ON "PaymentLog"("paidMonth");
