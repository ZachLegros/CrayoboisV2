-- DropForeignKey
ALTER TABLE "customProduct" DROP CONSTRAINT "customProduct_clientOrderId_fkey";

-- AlterTable
ALTER TABLE "customProduct" ADD COLUMN     "checkoutSessionId" TEXT,
ALTER COLUMN "clientOrderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_clientOrderId_fkey" FOREIGN KEY ("clientOrderId") REFERENCES "clientOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "CheckoutSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
