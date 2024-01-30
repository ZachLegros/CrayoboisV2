import prisma from "@/lib/prisma";
import OrdersTable from "./orders-table";

export default async function AdminOrders() {
  const orders = await prisma.clientOrder.findMany();

  return (
    <div className="flex flex-auto  justify-center items-center md:p-3 md:border rounded-xl">
      <OrdersTable orders={orders} />
    </div>
  );
}
