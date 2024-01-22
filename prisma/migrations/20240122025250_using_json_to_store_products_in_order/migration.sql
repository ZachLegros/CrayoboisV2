/*
  Warnings:

  - You are about to drop the column `clientOrderId` on the `customProduct` table. All the data in the column will be lost.
  - You are about to drop the `_ClientOrderToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'cancelled';

-- DropForeignKey
ALTER TABLE "_ClientOrderToProduct" DROP CONSTRAINT "_ClientOrderToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientOrderToProduct" DROP CONSTRAINT "_ClientOrderToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "customProduct" DROP CONSTRAINT "customProduct_clientOrderId_fkey";

-- AlterTable
ALTER TABLE "clientOrder" ADD COLUMN     "custom_products" JSONB,
ADD COLUMN     "products" JSONB;

-- AlterTable
ALTER TABLE "customProduct" DROP COLUMN "clientOrderId";

-- DropTable
DROP TABLE "_ClientOrderToProduct";
