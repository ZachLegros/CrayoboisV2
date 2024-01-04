/*
  Warnings:

  - You are about to drop the `_ClientOrderToCustomProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClientOrderToCustomProduct" DROP CONSTRAINT "_ClientOrderToCustomProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientOrderToCustomProduct" DROP CONSTRAINT "_ClientOrderToCustomProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "customProduct" DROP CONSTRAINT "customProduct_hardware_id_fkey";

-- DropForeignKey
ALTER TABLE "customProduct" DROP CONSTRAINT "customProduct_material_id_fkey";

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "is_custom" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "image" DROP NOT NULL;

-- DropTable
DROP TABLE "_ClientOrderToCustomProduct";

-- DropTable
DROP TABLE "customProduct";
