/*
  Warnings:

  - You are about to drop the column `userId` on the `clientOrder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "clientOrder" DROP CONSTRAINT "clientOrder_userId_fkey";

-- AlterTable
ALTER TABLE "clientOrder" DROP COLUMN "userId",
ADD COLUMN     "user_id" UUID;

-- AddForeignKey
ALTER TABLE "clientOrder" ADD CONSTRAINT "clientOrder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
