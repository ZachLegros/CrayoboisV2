import { type OrderStatus, PrismaClient } from "@prisma/client";
import orders from "./clientOrders.json";
import hardwares from "./hardwares.json";
import materials from "./materials.json";
import products from "./products.json";

const prisma = new PrismaClient();

try {
  await prisma.$transaction([
    prisma.cartCustomItem.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.checkoutSession.deleteMany(),
    prisma.product.deleteMany(),
    prisma.customProduct.deleteMany(),
    prisma.hardware.deleteMany(),
    prisma.material.deleteMany(),
    prisma.shipping.deleteMany(),
    prisma.clientOrder.deleteMany(),
    prisma.$queryRaw`TRUNCATE TABLE "clientOrder" RESTART IDENTITY`,
  ]);

  const hardwareTx = await prisma.hardware.createMany({
    data: hardwares,
  });
  const materialTx = await prisma.material.createMany({
    data: materials,
  });
  console.log({ hardwareTx, materialTx });

  const productTx = await prisma.product.createMany({
    data: products,
  });
  console.log({ productTx });

  const shippingTx = await prisma.shipping.createMany({
    data: [
      {
        name: "Sans suivi du colis",
        price: 4.5,
      },
      {
        name: "Avec suivi du colis",
        price: 12.31,
      },
      {
        name: "Gratuit",
        price: 0.0,
      },
    ],
  });
  console.log({ shippingTx });

  for (const orderData of orders.sort((a, b) => a.order_no - b.order_no)) {
    const { custom_products, ...order } = orderData;
    const { payer_email } = order;
    await prisma.customProduct.createMany({
      data: custom_products.map((custom_product) => ({
        id: custom_product.id,
        name: custom_product.name,
        quantity: custom_product.quantity,
        price: custom_product.price,
        material_id: custom_product.material_id,
        hardware_id: custom_product.hardware_id,
      })),
    });
    const customProducts = await prisma.customProduct.findMany({
      where: {
        id: {
          in: custom_products.map((custom_product) => custom_product.id),
        },
      },
      include: {
        material: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        },
        hardware: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });

    const createQuery = await prisma.clientOrder.create({
      data: {
        ...order,
        status: order.status as OrderStatus,
        user: {
          connect: {
            email: payer_email,
          },
        },
        order_no: undefined,
        custom_products: customProducts,
      },
    });
    console.log("Created order #", createQuery.order_no);
  }

  console.log("Orders created:", orders.length);
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
