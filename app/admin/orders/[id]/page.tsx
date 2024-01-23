import prisma from "@/lib/prisma";
import OrderDetails from "./order-details";

export default async function Order({ params }: { params: { id: string } }) {
  const order = await prisma.clientOrder
    .findUnique({
      where: { id: params.id },
    })
    .catch((err) => console.error(err));

  if (!order) {
    return <div>La commande n'existe pas.</div>;
  }

  return <OrderDetails order={order} />;
}
