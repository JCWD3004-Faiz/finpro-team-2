/*
  Warnings:

  - You are about to drop the column `code` on the `Vouchers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[voucher_code]` on the table `UserVouchers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `voucher_code` to the `UserVouchers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "finpro"."Vouchers_code_key";

-- AlterTable
ALTER TABLE "finpro"."UserVouchers" ADD COLUMN     "voucher_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "finpro"."Vouchers" DROP COLUMN "code";

-- CreateIndex
CREATE UNIQUE INDEX "UserVouchers_voucher_code_key" ON "finpro"."UserVouchers"("voucher_code");
