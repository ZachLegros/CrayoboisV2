import { PrismaClient } from "@prisma/client";
import hardwares from "./hardwares.json";
import materials from "./materials.json";
import orders from "./clientOrders.json";
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

  for (const orderData of orders.sort((a, b) => a.order_no - b.order_no)) {
    const { custom_products, ...order } = orderData;
    const { email, ...orderWithoutEmail } = order;
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
      // @ts-ignore
      data: {
        ...orderWithoutEmail,
        user_id: await prisma.profile
          .findFirst({ where: { email } })
          .then((profile) => profile?.id),
        order_no: undefined,
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
