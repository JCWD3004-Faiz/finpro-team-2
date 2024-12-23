/*
  Warnings:

  - You are about to drop the column `type` on the `Vouchers` table. All the data in the column will be lost.
  - Added the required column `voucher_type` to the `Vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "finpro"."Vouchers" DROP COLUMN "type",
ADD COLUMN     "voucher_type" "finpro"."VoucherType" NOT NULL;
