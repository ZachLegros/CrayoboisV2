export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import OrdersTable from "./orders-table";

export default async function AdminOrders() {
  const orders = await prisma.clientOrder.findMany();

  return (
    <div className="flex flex-col flex-auto max-w-full">
      <div className="flex-auto h-0 overflow-auto">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
