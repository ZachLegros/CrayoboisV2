/*
  Warnings:

  - The primary key for the `shipping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `shipping` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "shipping" DROP CONSTRAINT "shipping_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "shipping_pkey" PRIMARY KEY ("id");
