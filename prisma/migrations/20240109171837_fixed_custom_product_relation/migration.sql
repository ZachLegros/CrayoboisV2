/*
  Warnings:

  - A unique constraint covering the columns `[customProductId]` on the table `cartCustomItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cartCustomItem_customProductId_key" ON "cartCustomItem"("customProductId");
