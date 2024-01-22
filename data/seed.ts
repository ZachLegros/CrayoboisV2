import { OrderStatus, PrismaClient } from "@prisma/client";
import hardwares from "./hardwares.json";
import materials from "./materials.json";
import orders from "./clientOrdersDev.json";
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

  const createOrderPromises: any[] = [];
  for (const orderData of orders) {
    const { custom_products, ...order } = orderData;
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

    const createQuery = prisma.clientOrder.create({
      data: {
        ...order,
        status: order.status as OrderStatus,
        user: undefined,
        custom_products: customProducts,
      },
    });
    createOrderPromises.push(createQuery);
  }
  await Promise.all(createOrderPromises);

  console.log("Orders created:", orders.length);
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
