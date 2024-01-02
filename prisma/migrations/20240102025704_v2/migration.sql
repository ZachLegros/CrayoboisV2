/*
  Warnings:

  - The values [fabricating] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `orderId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address_city` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_state` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_street` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_zip` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('pending', 'shipped');
ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_userId_fkey";

-- AlterTable
ALTER TABLE "hardware" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "material" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "address_city" TEXT NOT NULL,
ADD COLUMN     "address_state" TEXT NOT NULL,
ADD COLUMN     "address_street" TEXT NOT NULL,
ADD COLUMN     "address_zip" TEXT NOT NULL,
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "shipping" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tax" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "orderId";

-- DropTable
DROP TABLE "address";

-- CreateTable
CREATE TABLE "shipping" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "shipping_pkey" PRIMARY KEY ("id")
);
