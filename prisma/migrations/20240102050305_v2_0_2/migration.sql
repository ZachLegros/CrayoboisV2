/*
  Warnings:

  - You are about to drop the `_OrderToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrderToProduct" DROP CONSTRAINT "_OrderToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToProduct" DROP CONSTRAINT "_OrderToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_userId_fkey";

-- DropTable
DROP TABLE "_OrderToProduct";

-- DropTable
DROP TABLE "order";

-- CreateTable
CREATE TABLE "clientOrder" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shippedAt" TIMESTAMP(3),
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "userId" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "shipping" DOUBLE PRECISION NOT NULL,
    "address_street" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_country" TEXT NOT NULL,
    "address_zip" TEXT NOT NULL,

    CONSTRAINT "clientOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientOrderToProduct" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientOrderToProduct_AB_unique" ON "_ClientOrderToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientOrderToProduct_B_index" ON "_ClientOrderToProduct"("B");

-- AddForeignKey
ALTER TABLE "clientOrder" ADD CONSTRAINT "clientOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientOrderToProduct" ADD CONSTRAINT "_ClientOrderToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "clientOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientOrderToProduct" ADD CONSTRAINT "_ClientOrderToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
