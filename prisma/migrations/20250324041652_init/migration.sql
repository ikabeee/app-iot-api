-- DropForeignKey
ALTER TABLE "Plot" DROP CONSTRAINT "Plot_userId_fkey";

-- AlterTable
ALTER TABLE "Plot" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Plot" ADD CONSTRAINT "Plot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
