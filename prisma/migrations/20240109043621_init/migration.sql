-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'shipped');

-- CreateEnum
CREATE TYPE "CheckoutSessionStatus" AS ENUM ('ongoing', 'completed', 'expired', 'aborted');

-- CreateTable
CREATE TABLE "profile" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "nature" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardware" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "hardware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "image" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customProduct" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "material_id" UUID NOT NULL,
    "hardware_id" UUID NOT NULL,
    "clientOrderId" UUID,
    "checkoutSessionId" UUID,

    CONSTRAINT "customProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "shipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientOrder" (
    "id" UUID NOT NULL,
    "order_no" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "payer_email" TEXT NOT NULL,
    "payer_name" TEXT NOT NULL,
    "user_id" UUID,
    "amount" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "shipping" DOUBLE PRECISION NOT NULL,
    "address_street" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_country" TEXT NOT NULL,
    "address_zip" TEXT NOT NULL,

    CONSTRAINT "clientOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartItem" (
    "id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "productId" UUID NOT NULL,
    "checkoutSessionId" UUID NOT NULL,

    CONSTRAINT "cartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartCustomItem" (
    "id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "customProductId" UUID NOT NULL,
    "checkoutSessionId" UUID NOT NULL,

    CONSTRAINT "cartCustomItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkoutSession" (
    "id" UUID NOT NULL,
    "sid" TEXT NOT NULL,
    "status" "CheckoutSessionStatus" NOT NULL DEFAULT 'ongoing',
    "expires_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shipping_id" UUID NOT NULL,

    CONSTRAINT "checkoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientOrderToProduct" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_CheckoutSessionToProduct" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_email_key" ON "profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientOrder_order_no_key" ON "clientOrder"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "checkoutSession_sid_key" ON "checkoutSession"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "_ClientOrderToProduct_AB_unique" ON "_ClientOrderToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientOrderToProduct_B_index" ON "_ClientOrderToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CheckoutSessionToProduct_AB_unique" ON "_CheckoutSessionToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CheckoutSessionToProduct_B_index" ON "_CheckoutSessionToProduct"("B");

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_hardware_id_fkey" FOREIGN KEY ("hardware_id") REFERENCES "hardware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_clientOrderId_fkey" FOREIGN KEY ("clientOrderId") REFERENCES "clientOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customProduct" ADD CONSTRAINT "customProduct_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "checkoutSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientOrder" ADD CONSTRAINT "clientOrder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "checkoutSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartCustomItem" ADD CONSTRAINT "cartCustomItem_customProductId_fkey" FOREIGN KEY ("customProductId") REFERENCES "customProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartCustomItem" ADD CONSTRAINT "cartCustomItem_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "checkoutSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkoutSession" ADD CONSTRAINT "checkoutSession_shipping_id_fkey" FOREIGN KEY ("shipping_id") REFERENCES "shipping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientOrderToProduct" ADD CONSTRAINT "_ClientOrderToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "clientOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientOrderToProduct" ADD CONSTRAINT "_ClientOrderToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CheckoutSessionToProduct" ADD CONSTRAINT "_CheckoutSessionToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "checkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CheckoutSessionToProduct" ADD CONSTRAINT "_CheckoutSessionToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
