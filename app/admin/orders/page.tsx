import prisma from "@/lib/prisma";
import OrdersTable from "./orders-table";

export default async function AdminOrders() {
  const orders = (await prisma.clientOrder.findMany()).sort(
    (a, b) => b.order_no - a.order_no
  );

  return (
    <div className="p-3 border rounded-xl">
      <OrdersTable orders={orders} />
    </div>
  );
}
