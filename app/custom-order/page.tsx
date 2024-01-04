import prisma from "@/lib/prisma";
import OrderBuilder from "./order-builder";

export default async function CustomOrder() {
  const [materials, hardwares] = await Promise.all([
    prisma.material.findMany({ where: { NOT: { quantity: 0 } } }),
    prisma.hardware.findMany({ where: { NOT: { quantity: 0 } } }),
  ]);

  return (
    <div className="w-full">
      <OrderBuilder materials={materials} hardwares={hardwares} />
    </div>
  );
}
