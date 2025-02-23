-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "cashDifference" DECIMAL(10,2),
ADD COLUMN     "expectedCash" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastActive" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ALTER COLUMN "passwordHash" SET DATA TYPE VARCHAR(60);
