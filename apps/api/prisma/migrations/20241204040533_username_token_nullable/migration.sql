/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `PendingRegistrations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "finpro"."PendingRegistrations" ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "verification_token" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistrations_username_key" ON "finpro"."PendingRegistrations"("username");
