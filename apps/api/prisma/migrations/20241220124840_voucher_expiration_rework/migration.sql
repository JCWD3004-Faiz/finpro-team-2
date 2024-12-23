/*
  Warnings:

  - You are about to drop the column `is_used` on the `UserVouchers` table. All the data in the column will be lost.
  - You are about to drop the column `expiration_date` on the `Vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `Vouchers` table. All the data in the column will be lost.
  - Added the required column `expiration_date` to the `UserVouchers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voucher_status` to the `UserVouchers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expire_period` to the `Vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "finpro"."VoucherStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'USED');

-- AlterTable
ALTER TABLE "finpro"."UserVouchers" DROP COLUMN "is_used",
ADD COLUMN     "expiration_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "voucher_status" "finpro"."VoucherStatus" NOT NULL;

-- AlterTable
ALTER TABLE "finpro"."Vouchers" DROP COLUMN "expiration_date",
DROP COLUMN "is_active",
ADD COLUMN     "expire_period" INTEGER NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
