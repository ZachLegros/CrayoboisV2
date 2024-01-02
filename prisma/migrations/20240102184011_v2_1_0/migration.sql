/*
  Warnings:

  - The primary key for the `clientOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[order_no]` on the table `clientOrder` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `A` on the `_ClientOrderToProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `clientOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_ClientOrderToProduct" DROP CONSTRAINT "_ClientOrderToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "clientOrder" DROP CONSTRAINT "clientOrder_userId_fkey";

-- AlterTable
ALTER TABLE "_ClientOrderToProduct" DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL;

-- AlterTable
ALTER TABLE "clientOrder" DROP CONSTRAINT "clientOrder_pkey",
ADD COLUMN     "order_no" SERIAL NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ADD CONSTRAINT "clientOrder_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "_ClientOrderToProduct_AB_unique" ON "_ClientOrderToProduct"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "clientOrder_order_no_key" ON "clientOrder"("order_no");

-- AddForeignKey
ALTER TABLE "clientOrder" ADD CONSTRAINT "clientOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientOrderToProduct" ADD CONSTRAINT "_ClientOrderToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "clientOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
