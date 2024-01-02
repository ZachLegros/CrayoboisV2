import { prisma } from "@/utils/prisma";

export default async function Orders() {
  const orders = await prisma.clientOrder.findMany({
    include: {
      product: {
        include: {
          hardware: true,
          material: true,
        },
      },
    },
  });

  return <pre>{JSON.stringify(orders, null, 2)}</pre>;
}
