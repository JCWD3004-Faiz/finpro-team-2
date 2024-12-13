/*
  Warnings:

  - Changed the type of `city_id` on the `Address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "finpro"."Address" DROP COLUMN "city_id",
ADD COLUMN     "city_id" INTEGER NOT NULL;
