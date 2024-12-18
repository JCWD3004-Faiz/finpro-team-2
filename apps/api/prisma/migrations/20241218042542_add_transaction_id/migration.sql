/*
  Warnings:

  - A unique constraint covering the columns `[transaction_id]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_id` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "finpro"."Payments" ADD COLUMN     "transaction_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payments_transaction_id_key" ON "finpro"."Payments"("transaction_id");
