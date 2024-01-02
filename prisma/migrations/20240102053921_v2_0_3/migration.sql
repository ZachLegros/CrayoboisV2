/*
  Warnings:

  - You are about to drop the column `createdAt` on the `clientOrder` table. All the data in the column will be lost.
  - You are about to drop the column `shippedAt` on the `clientOrder` table. All the data in the column will be lost.
  - You are about to drop the column `hardwareId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `materialId` on the `product` table. All the data in the column will be lost.
  - Added the required column `payer_email` to the `clientOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hardware_id` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_hardwareId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_materialId_fkey";

-- AlterTable
ALTER TABLE "clientOrder" DROP COLUMN "createdAt",
DROP COLUMN "shippedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payer_email" TEXT NOT NULL,
ADD COLUMN     "shipped_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product" DROP COLUMN "hardwareId",
DROP COLUMN "materialId",
ADD COLUMN     "hardware_id" UUID NOT NULL,
ADD COLUMN     "material_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_hardware_id_fkey" FOREIGN KEY ("hardware_id") REFERENCES "hardware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
