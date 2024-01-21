"use client";

import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { dayjs, getTps } from "@/lib/utils";
import { ClientOrder } from "@prisma/client";
import { useMemo } from "react";
import { getNetAmount, primaryColor } from "./common";
import { cad, cadPrecision } from "@/lib/currencyFormatter";
import { getTvq } from "../../lib/utils";

export default function NetRevenueChart(props: { orders: ClientOrder[] }) {
  const { orders } = props;
  const { resolvedTheme } = useTheme();

  const revenueSeries = useMemo(() => {
    const x = orders.map((order) => dayjs(order.created_at).valueOf());
    const y: number[] = [];
    for (let i = 0; i < orders.length; i++) {
      if (i === 0) {
        y.push(cadPrecision(getNetAmount(orders[i])));
      } else {
        y.push(cadPrecision(getNetAmount(orders[i]) + y[i - 1]));
      }
    }
    return { x, y };
  }, [orders]);

  const shipping = useMemo(() => {
    return orders.reduce((acc, order) => acc + order.shipping, 0);
  }, [orders]);

  const tps = useMemo(() => {
    return orders.reduce((acc, order) => acc + getTps(getNetAmount(order)), 0);
  }, [orders]);

  const tvq = useMemo(() => {
    return orders.reduce((acc, order) => acc + getTvq(getNetAmount(order)), 0);
  }, [orders]);

  const options: ApexOptions = {
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "straight",
      colors: [primaryColor],
    },
    fill: {
      opacity: 0.3,
      colors: [primaryColor],
    },
    xaxis: {
      crosshairs: {
        width: 1,
      },
      type: "datetime",
      labels: {
        formatter: (value) => dayjs(value).format("D MMMM YYYY"),
      },
    },
    yaxis: {
      min: 0,
      show: false,
    },
    tooltip: {
      theme: resolvedTheme,
    },
  };

  const series: ApexAxisChartSeries = [
    {
      name: "Revenu net",
      data: revenueSeries.x.map((x, i) => ({ x, y: revenueSeries.y[i] })),
      color: primaryColor,
    },
  ];

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <Card className="p-2 w-full">
      <div className="flex gap-4 flex-wrap">
        <div>
          <h3 className="text-foreground/70 font-medium">Revenu net</h3>
          <h1 className="text-xl font-semibold mb-2">
            {cad(revenueSeries.y[revenueSeries.y.length - 1])}
          </h1>
        </div>
        <div>
          <h3 className="text-foreground/70 font-medium">TVQ</h3>
          <h1 className="text-xl font-semibold mb-2">{cad(tvq)}</h1>
        </div>
        <div>
          <h3 className="text-foreground/70 font-medium">TPS</h3>
          <h1 className="text-xl font-semibold mb-2">{cad(tps)}</h1>
        </div>
        <div>
          <h3 className="text-foreground/70 font-medium">Livraison</h3>
          <h1 className="text-xl font-semibold mb-2">{cad(shipping)}</h1>
        </div>
      </div>
      <Chart options={options} series={series} type="area" height={400} />
    </Card>
  );
}
