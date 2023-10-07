/*
  Warnings:

  - You are about to drop the column `tokenId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tokenId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tokenId",
ADD COLUMN     "resetTokenId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_resetTokenId_fkey" FOREIGN KEY ("resetTokenId") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;
