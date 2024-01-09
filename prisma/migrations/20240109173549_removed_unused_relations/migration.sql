/*
  Warnings:

  - You are about to drop the column `checkoutSessionId` on the `customProduct` table. All the data in the column will be lost.
  - You are about to drop the `_CheckoutSessionToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CheckoutSessionToProduct" DROP CONSTRAINT "_CheckoutSessionToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_CheckoutSessionToProduct" DROP CONSTRAINT "_CheckoutSessionToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "customProduct" DROP CONSTRAINT "customProduct_checkoutSessionId_fkey";

-- AlterTable
ALTER TABLE "customProduct" DROP COLUMN "checkoutSessionId";

-- DropTable
DROP TABLE "_CheckoutSessionToProduct";
