import prisma from "@/lib/prisma";
import hardwares from "./data/hardwares.json";
import materials from "./data/materials.json";
import orders from "./data/orders.json";
import { OrderStatus } from "@prisma/client";

async function sequentialAsyncOperations<T>(
  values: T[],
  asyncOperation: (value: T) => Promise<any>
) {
  try {
    const result = await values.reduce(async (previousPromise: Promise<any>, currentValue: T) => {
      const currentResult = await asyncOperation(currentValue);
      await previousPromise;
      return [...(await previousPromise), currentResult];
    }, Promise.resolve([]));
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

try {
  const hardware = await prisma.hardware.createMany({
    data: hardwares,
  });
  const material = await prisma.material.createMany({
    data: materials,
  });
  console.log({ hardware, material });

  const result = await sequentialAsyncOperations(orders, async (order) => {
    // find userId
    const userId = await prisma.profile
      .findFirst({
        where: { email: { equals: order.account_email } },
        select: { id: true },
      })
      .then((profile) => profile?.id);

    if (!userId) {
      console.log("User id error for:", order);
      return;
    }

    // find materialId
    const materialInfos = await sequentialAsyncOperations(order.products, async (product) => {
      const material = await prisma.material.findFirst({
        where: { name: { equals: product.materialName } },
        select: { id: true, price: true },
      });
      return material;
    });

    // find hardwareId
    const hardwareInfos = await sequentialAsyncOperations(order.products, async (product) => {
      const hardware = await prisma.hardware.findFirst({
        where: {
          name: { equals: product.hardwareName },
          color: { equals: product.hardwareColor },
        },
        select: { id: true, price: true },
      });
      return hardware;
    });

    if (
      !materialInfos ||
      !hardwareInfos ||
      materialInfos.includes(undefined) ||
      hardwareInfos.includes(undefined)
    ) {
      console.log("Material/Hardware error for:", order, materialInfos, hardwareInfos);
      return;
    }

    order.products.forEach((product, index) => {
      product["materialId"] = materialInfos[index].id;
      product["materialPrice"] = materialInfos[index].price;
      product["hardwareId"] = hardwareInfos[index].id;
      product["hardwarePrice"] = hardwareInfos[index].price;
    });

    // create order and products
    const createdOrder = await prisma.clientOrder.create({
      data: {
        order_no: order.order_no,
        created_at: order.createdAt,
        user_id: userId,
        payer_email: order.payer_email,
        payer_name: order.name,
        status: order.status as OrderStatus,
        amount: order.price.total,
        shipping: order.price.shipping,
        tax: order.price.tax,
        address_country: order.country,
        address_state: order.state,
        address_city: order.city,
        address_street: order.address,
        address_zip: order.postalCode,
        products: {
          create: order.products.map((product) => ({
            name: `${product.materialName}, ${product.hardwareName} ${product.hardwareColor}`,
            quantity: product.quantity,
            price: product.hardwarePrice + product.materialPrice,
            material_id: product.materialId,
            hardware_id: product.hardwareId,
            is_custom: true,
          })),
        },
      },
      include: {
        products: true,
      },
    });
    return createdOrder;
  });
  if (result) {
    console.log(result.filter((value) => value !== undefined).length, "orders created");
    console.log(
      result.length - result.filter((value) => value !== undefined).length,
      "orders failed"
    );
  }
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
