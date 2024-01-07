/*
  Warnings:

  - You are about to drop the column `hardware_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_custom` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `product` table. All the data in the column will be lost.
  - Made the column `image` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CheckoutSessionStatus" AS ENUM ('ongoing', 'completed');

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_hardware_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_material_id_fkey";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "hardware_id",
DROP COLUMN "is_custom",
DROP COLUMN "material_id",
ALTER COLUMN "image" SET NOT NULL;

-- CreateTable
CREATE TABLE "customProduct" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "material_id" UUID NOT NULL,
    "hardware_id" UUID NOT NULL,
    "clientOrderId" UUID NOT NULL,

    CONSTRAINT "customProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutSession" (
    "id" TEXT NOT NULL,
    "status" "CheckoutSessionStatus" NOT NULL DEFAULT 'ongoing',

    CONSTRAINT "CheckoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CheckoutSessionToProduct" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CheckoutSessionToProduct_AB_unique" ON "_CheckoutSessionToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CheckoutSessionToProduct_B_index" ON "_CheckoutSessionToProduct"("B");

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_hardware_id_fkey" FOREIGN KEY ("hardware_id") REFERENCES "hardware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_clientOrderId_fkey" FOREIGN KEY ("clientOrderId") REFERENCES "clientOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CheckoutSessionToProduct" ADD CONSTRAINT "_CheckoutSessionToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "CheckoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CheckoutSessionToProduct" ADD CONSTRAINT "_CheckoutSessionToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
