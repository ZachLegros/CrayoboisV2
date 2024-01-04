/*
  Warnings:

  - You are about to drop the column `hardware_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `product` table. All the data in the column will be lost.
  - Made the column `image` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_hardware_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_material_id_fkey";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "hardware_id",
DROP COLUMN "material_id",
ADD COLUMN     "hardwareId" UUID,
ADD COLUMN     "materialId" UUID,
ALTER COLUMN "image" SET NOT NULL;

-- CreateTable
CREATE TABLE "customProduct" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "material_id" UUID NOT NULL,
    "hardware_id" UUID NOT NULL,

    CONSTRAINT "customProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientOrderToCustomProduct" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientOrderToCustomProduct_AB_unique" ON "_ClientOrderToCustomProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientOrderToCustomProduct_B_index" ON "_ClientOrderToCustomProduct"("B");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_hardwareId_fkey" FOREIGN KEY ("hardwareId") REFERENCES "hardware"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_hardware_id_fkey" FOREIGN KEY ("hardware_id") REFERENCES "hardware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientOrderToCustomProduct" ADD CONSTRAINT "_ClientOrderToCustomProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "clientOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientOrderToCustomProduct" ADD CONSTRAINT "_ClientOrderToCustomProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "customProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
