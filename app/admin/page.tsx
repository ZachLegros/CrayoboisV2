import prisma from "@/lib/prisma";
import Metrics from "./metrics";
import NetRevenueChart from "./net-revenue-chart";

export default async function AdminPage() {
  const orders = await prisma.clientOrder.findMany();

  return (
    <div className="flex flex-col gap-3">
      <Metrics orders={orders} />
      <NetRevenueChart orders={orders} />
    </div>
  );
}
