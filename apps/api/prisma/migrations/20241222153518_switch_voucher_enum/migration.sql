/*
  Warnings:

  - The values [SHIPPING_DISCOUNT,PRODUCT_DISCOUNT,CART_DISCOUNT] on the enum `DiscountTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [PERCENTAGE,NOMINAL] on the enum `VoucherType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "finpro"."DiscountTypeEnum_new" AS ENUM ('PERCENTAGE', 'NOMINAL');
ALTER TABLE "finpro"."Vouchers" ALTER COLUMN "discount_type" TYPE "finpro"."DiscountTypeEnum_new" USING ("discount_type"::text::"finpro"."DiscountTypeEnum_new");
ALTER TYPE "finpro"."DiscountTypeEnum" RENAME TO "DiscountTypeEnum_old";
ALTER TYPE "finpro"."DiscountTypeEnum_new" RENAME TO "DiscountTypeEnum";
DROP TYPE "finpro"."DiscountTypeEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "finpro"."VoucherType_new" AS ENUM ('SHIPPING_DISCOUNT', 'PRODUCT_DISCOUNT', 'CART_DISCOUNT');
ALTER TABLE "finpro"."Vouchers" ALTER COLUMN "voucher_type" TYPE "finpro"."VoucherType_new" USING ("voucher_type"::text::"finpro"."VoucherType_new");
ALTER TYPE "finpro"."VoucherType" RENAME TO "VoucherType_old";
ALTER TYPE "finpro"."VoucherType_new" RENAME TO "VoucherType";
DROP TYPE "finpro"."VoucherType_old";
COMMIT;
