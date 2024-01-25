import prisma from "@/lib/prisma";
import OrderBuilder from "./order-builder";

export default async function CustomOrderPage() {
  const [materials, hardwares] = await Promise.all([
    prisma.material.findMany({ where: { enabled: { equals: true } } }),
    prisma.hardware.findMany({ where: { enabled: { equals: true } } }),
  ]);

  return <OrderBuilder materials={materials} hardwares={hardwares} />;
}
