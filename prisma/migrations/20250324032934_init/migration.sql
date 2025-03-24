/*
  Warnings:

  - Added the required column `status` to the `Plot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plot" ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL;
