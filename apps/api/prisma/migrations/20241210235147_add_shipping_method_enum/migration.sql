/*
  Warnings:

  - The `shipping_method` column on the `Orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "finpro"."ShippingMethod" AS ENUM ('jne', 'pos', 'tiki');

-- AlterTable
ALTER TABLE "finpro"."Orders" DROP COLUMN "shipping_method",
ADD COLUMN     "shipping_method" "finpro"."ShippingMethod" NOT NULL DEFAULT 'jne';
