import prisma from "@/lib/prisma";
import OrdersTable from "./orders-table";

export default async function AdminOrders() {
  const orders = await prisma.clientOrder.findMany();

  return (
    <div className="md:p-3 md:border rounded-xl">
      <OrdersTable orders={orders} />
    </div>
  );
}
