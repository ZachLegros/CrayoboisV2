import { ClientOrder } from "@prisma/client";
import { useMemo } from "react";
import Metric from "./metric";
import { cad, cadPrecision } from "@/lib/currencyFormatter";
import { dayjs } from "@/lib/utils";

export default function Metrics(props: { orders: ClientOrder[] }) {
  const { orders } = props;

  const metrics = useMemo(() => {
    const x = orders.map((order) => dayjs(order.created_at).valueOf());
    const ordersAmountY: number[] = [];
    const revenueY: number[] = [];
    const clientsY: number[] = [];
    const emails = new Set<string>();
    for (let i = 0; i < orders.length; i++) {
      if (i === 0) {
        ordersAmountY.push(1);
        revenueY.push(cadPrecision(orders[i].amount));
        clientsY.push(1);
        emails.add(orders[i].payer_email);
      } else {
        ordersAmountY.push(ordersAmountY[i - 1] + 1);
        revenueY.push(cadPrecision(orders[i].amount + revenueY[i - 1]));
        if (!emails.has(orders[i].payer_email)) {
          clientsY.push(clientsY[i - 1] + 1);
          emails.add(orders[i].payer_email);
        } else {
          clientsY.push(clientsY[i - 1]);
        }
      }
    }

    return {
      revenue: {
        name: "Revenu brut",
        data: x.map((x, i) => ({ x, y: revenueY[i] })),
        currentValue: `${cad(revenueY[revenueY.length - 1])}`,
      },
      ordersAmount: {
        name: "Commandes",
        data: x.map((x, i) => ({ x, y: ordersAmountY[i] })),
        currentValue: `${orders.length}`,
      },
      clients: {
        name: "Clients",
        data: x.map((x, i) => ({ x, y: clientsY[i] })),
        currentValue: `${clientsY[clientsY.length - 1]}`,
      },
    };
  }, [orders]);

  return (
    <div className="flex flex-wrap gap-3">
      {Object.values(metrics).map((metric) => (
        <Metric key={metric.name} {...metric} />
      ))}
    </div>
  );
}
