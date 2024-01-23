/*
  Warnings:

  - You are about to drop the column `role` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profile" DROP COLUMN "role";

-- DropEnum
DROP TYPE "Role";
