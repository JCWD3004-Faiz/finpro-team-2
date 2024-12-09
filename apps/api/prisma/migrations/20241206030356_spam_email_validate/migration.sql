/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `PendingRegistrations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `PendingRegistrations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attempts` to the `PendingRegistrations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "finpro"."PendingRegistrations" ADD COLUMN     "attempts" INTEGER NOT NULL,
ADD COLUMN     "is_blocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_attempt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistrations_email_key" ON "finpro"."PendingRegistrations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistrations_username_key" ON "finpro"."PendingRegistrations"("username");
