/*
  Warnings:

  - Added the required column `address_country` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "address_country" TEXT NOT NULL;
