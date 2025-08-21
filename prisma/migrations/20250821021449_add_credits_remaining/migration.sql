/*
  Warnings:

  - Added the required column `creditsRemaining` to the `purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tattootraceai"."purchase" ADD COLUMN     "creditsRemaining" INTEGER NOT NULL,
ADD COLUMN     "creditsUsed" INTEGER NOT NULL DEFAULT 0;
