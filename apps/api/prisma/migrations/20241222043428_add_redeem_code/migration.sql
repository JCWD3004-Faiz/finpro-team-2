/*
  Warnings:

  - You are about to drop the column `voucher_code` on the `UserVouchers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[redeem_code]` on the table `UserVouchers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `redeem_code` to the `UserVouchers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "finpro"."UserVouchers_voucher_code_key";

-- AlterTable
ALTER TABLE "finpro"."UserVouchers" DROP COLUMN "voucher_code",
ADD COLUMN     "redeem_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserVouchers_redeem_code_key" ON "finpro"."UserVouchers"("redeem_code");
