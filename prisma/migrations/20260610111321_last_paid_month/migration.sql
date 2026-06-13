/*
  Warnings:

  - You are about to drop the column `note` on the `PaymentLog` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDate` on the `PaymentLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Musulli" ADD COLUMN     "lastPaidMonth" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PaymentLog" DROP COLUMN "note",
DROP COLUMN "paymentDate",
ADD COLUMN     "isFullyPaid" BOOLEAN NOT NULL DEFAULT false;
