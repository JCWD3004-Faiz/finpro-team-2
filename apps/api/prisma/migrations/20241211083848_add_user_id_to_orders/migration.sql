/*
  Warnings:

  - Added the required column `user_id` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "finpro"."Orders" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "finpro"."Orders" ADD CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "finpro"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
