import { OrderStatus, PrismaClient } from "@prisma/client";
import hardwares from "./hardwares.json";
import materials from "./materials.json";
import orders from "./clientOrdersDev.json";
import products from "./products.json";

const prisma = new PrismaClient();

try {
  const hardware = await prisma.hardware.createMany({
    data: hardwares,
  });
  const material = await prisma.material.createMany({
    data: materials,
  });
  console.log({ hardware, material });

  const product = await prisma.product.createMany({
    data: products,
  });
  console.log({ product });

  const shipping = await prisma.shipping.createMany({
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
  console.log({ shipping });

  const createOrderPromises: any[] = [];

  for (const orderData of orders) {
    const { custom_products, ...order } = orderData;
    const createQuery = prisma.clientOrder.create({
      data: {
        ...order,
        status: order.status as OrderStatus,
        user_id: await prisma.profile
          .findFirst({ where: { email: order.payer_email } })
          .then((profile) => profile?.id),
        custom_products: {
          create: custom_products.map((custom_product) => ({
            id: custom_product.id,
            name: custom_product.name,
            quantity: custom_product.quantity,
            price: custom_product.price,
            material: {
              connect: { id: custom_product.material_id },
            },
            hardware: {
              connect: { id: custom_product.hardware_id },
            },
          })),
        },
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
