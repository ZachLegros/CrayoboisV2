"use client";

import Stat from "@/components/Stat";
import { Card } from "@/components/ui/card";
import { cad, cadPrecision } from "@/lib/currencyFormatter";
import { useMediaQuery } from "@/lib/hooks";
import { gtMd } from "@/lib/mediaQueries";
import { dayjs, getTps } from "@/lib/utils";
import { getTvq } from "@/lib/utils";
import type { ClientOrder } from "@prisma/client";
import type { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import { useEffect, useMemo } from "react";
import Chart from "./chart";
import {
  chartBgDark,
  chartBgLight,
  chartPrimary,
  chartSecondary,
  getNetAmount,
} from "./common";
import useAdminStore from "./store";

export default function NetRevenueChart(props: { orders: ClientOrder[] }) {
  const { orders } = props;
  const { setOrders } = useAdminStore();
  const { resolvedTheme } = useTheme();
  const showChartLabels = useMediaQuery(gtMd);

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

  const options: ApexOptions = useMemo(() => {
    return {
      chart: {
        background: resolvedTheme === "dark" ? chartBgDark : chartBgLight,
      },
      theme: {
        mode: resolvedTheme as "light" | "dark",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: [chartPrimary],
      },
      grid: {
        borderColor: chartSecondary,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          ...(!showChartLabels && { left: 0 }),
          ...(!showChartLabels && { right: 0 }),
        },
      },
      xaxis: {
        crosshairs: {
          width: 1,
        },
        type: "datetime",
        labels: {
          formatter: (value) => dayjs(value).format("D MMMM YYYY"),
          show: showChartLabels,
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => cad(value),
          show: showChartLabels,
        },
      },
      tooltip: {
        theme: resolvedTheme,
      },
    };
  }, [resolvedTheme, showChartLabels]);

  const series: ApexAxisChartSeries = useMemo(() => {
    return [
      {
        name: "Revenu net",
        data: revenueSeries.x.map((x, i) => ({ x, y: revenueSeries.y[i] })),
        color: chartPrimary,
      },
    ];
  }, [revenueSeries]);

  useEffect(() => {
    setOrders(orders);
  }, [orders]);

  return (
    <Card className="p-3 w-full shadow-none">
      <div className="flex gap-4 flex-wrap">
        <Stat
          name="Revenu net"
          value={cad(revenueSeries.y[revenueSeries.y.length - 1])}
        />
        <Stat name="TVQ" value={cad(tvq)} />
        <Stat name="TPS" value={cad(tps)} />
        <Stat name="Livraison" value={cad(shipping)} />
      </div>
      <div className="h-[425px]">
        <Chart options={options} series={series} type="area" height={425} />
      </div>
    </Card>
  );
}
