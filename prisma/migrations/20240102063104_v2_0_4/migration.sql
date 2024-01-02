/*
  Warnings:

  - You are about to drop the column `shipped_at` on the `clientOrder` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `profile` table. All the data in the column will be lost.
  - Added the required column `payer_name` to the `clientOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clientOrder" DROP COLUMN "shipped_at",
ADD COLUMN     "payer_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "name";
