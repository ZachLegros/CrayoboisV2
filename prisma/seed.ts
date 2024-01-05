import { PrismaClient } from "@prisma/client";
import hardwares from "./data/hardwares.json";
import materials from "./data/materials.json";
import orders from "./data/clientOrders.json";

const prisma = new PrismaClient();

try {
  const hardware = await prisma.hardware.createMany({
    data: hardwares,
  });
  const material = await prisma.material.createMany({
    data: materials,
  });
  console.log({ hardware, material });

  await prisma.shipping.create({
    data: {
      name: "Sans suivi du colis",
      price: 4.5,
    },
  });

  await prisma.shipping.create({
    data: {
      name: "Avec suivi du colis",
      price: 12.31,
    },
  });

  const createOrderPromises: any[] = [];

  for (const orderData of orders) {
    const { products, ...order } = orderData;
    const createQuery = prisma.clientOrder.create({
      // @ts-ignore
      data: {
        ...order,
        products: {
          create: products,
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
