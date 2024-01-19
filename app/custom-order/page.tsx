import prisma from "@/lib/prisma";
import OrderBuilder from "./order-builder";

export default async function CustomOrderPage() {
  const [materials, hardwares] = await Promise.all([
    prisma.material.findMany({ where: { enabled: true } }),
    prisma.hardware.findMany({ where: { enabled: true } }),
  ]);

  return <OrderBuilder materials={materials} hardwares={hardwares} />;
}
