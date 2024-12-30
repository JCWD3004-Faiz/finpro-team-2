-- AlterTable
ALTER TABLE "finpro"."CartItems" ADD COLUMN     "discount_amount" DECIMAL(10,2),
ADD COLUMN     "discount_type" "finpro"."DiscountTypeEnum";

-- AlterTable
ALTER TABLE "finpro"."Carts" ADD COLUMN     "discount_amount" DECIMAL(10,2),
ADD COLUMN     "discount_type" "finpro"."DiscountTypeEnum";

-- AlterTable
ALTER TABLE "finpro"."Orders" ADD COLUMN     "discount_amount" DECIMAL(10,2),
ADD COLUMN     "discount_type" "finpro"."DiscountTypeEnum";
