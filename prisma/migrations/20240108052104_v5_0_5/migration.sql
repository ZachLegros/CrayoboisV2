/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `checkoutSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "checkoutSession_id_key" ON "checkoutSession"("id");
