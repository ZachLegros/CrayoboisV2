export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import Metrics from "./metrics";
import NetRevenueChart from "./net-revenue-chart";

export default async function AdminPage() {
  const orders = (
    await prisma.clientOrder.findMany({
      where: { status: { not: "cancelled" } },
    })
  ).sort((a, b) => a.order_no - b.order_no);

  return (
    <div className="flex flex-col flex-auto gap-3">
      <Metrics orders={orders} />
      <NetRevenueChart orders={orders} />
    </div>
  );
}
