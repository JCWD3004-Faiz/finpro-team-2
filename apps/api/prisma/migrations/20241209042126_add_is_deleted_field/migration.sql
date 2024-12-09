-- AlterTable
ALTER TABLE "finpro"."Categories" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "finpro"."Discounts" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "finpro"."Products" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "finpro"."Stores" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
