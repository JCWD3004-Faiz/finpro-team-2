/*
  Warnings:

  - Added the required column `city_id` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_name` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_id` to the `Stores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "finpro"."Address" ADD COLUMN     "city_id" TEXT NOT NULL,
ADD COLUMN     "city_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "finpro"."Stores" ADD COLUMN     "city_id" INTEGER NOT NULL;
