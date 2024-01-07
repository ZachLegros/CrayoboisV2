/*
  Warnings:

  - You are about to drop the `CheckoutSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CheckoutSessionToProduct" DROP CONSTRAINT "_CheckoutSessionToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "customProduct" DROP CONSTRAINT "customProduct_checkoutSessionId_fkey";

-- DropTable
DROP TABLE "CheckoutSession";

-- CreateTable
CREATE TABLE "checkoutSession" (
    "id" TEXT NOT NULL,
    "status" "CheckoutSessionStatus" NOT NULL DEFAULT 'ongoing',

    CONSTRAINT "checkoutSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "checkoutSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CheckoutSessionToProduct" ADD CONSTRAINT "_CheckoutSessionToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "checkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
