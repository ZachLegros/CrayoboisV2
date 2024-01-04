/*
  Warnings:

  - You are about to drop the column `hardwareId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `materialId` on the `product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_hardwareId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_materialId_fkey";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "hardwareId",
DROP COLUMN "materialId",
ADD COLUMN     "hardware_id" UUID,
ADD COLUMN     "material_id" UUID;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_hardware_id_fkey" FOREIGN KEY ("hardware_id") REFERENCES "hardware"("id") ON DELETE SET NULL ON UPDATE CASCADE;
