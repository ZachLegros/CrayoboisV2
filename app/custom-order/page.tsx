import prisma from "@/lib/prisma";
import OrderBuilder from "./order-builder";

export default async function CustomOrder() {
  const [materials, hardwares] = await Promise.all([
    prisma.material.findMany(),
    prisma.hardware.findMany(),
  ]);

  return (
    <div className="w-full">
      <OrderBuilder materials={materials} hardwares={hardwares} />
    </div>
  );
}
