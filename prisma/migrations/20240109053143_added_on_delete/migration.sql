-- DropForeignKey
ALTER TABLE "cartCustomItem" DROP CONSTRAINT "cartCustomItem_checkoutSessionId_fkey";

-- DropForeignKey
ALTER TABLE "cartCustomItem" DROP CONSTRAINT "cartCustomItem_customProductId_fkey";

-- DropForeignKey
ALTER TABLE "cartItem" DROP CONSTRAINT "cartItem_checkoutSessionId_fkey";

-- DropForeignKey
ALTER TABLE "customProduct" DROP CONSTRAINT "customProduct_checkoutSessionId_fkey";

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "checkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "checkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartCustomItem" ADD CONSTRAINT "cartCustomItem_customProductId_fkey" FOREIGN KEY ("customProductId") REFERENCES "customProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartCustomItem" ADD CONSTRAINT "cartCustomItem_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "checkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
