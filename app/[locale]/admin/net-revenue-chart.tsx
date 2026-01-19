"use client";

import Stat from "@/components/Stat";
import { Card } from "@/components/ui/card";
import { cad, cadPrecision } from "@/lib/currencyFormatter";
import { useMediaQuery } from "@/lib/hooks";
import { gtMd } from "@/lib/mediaQueries";
import { dayjs, getNetAmount, getTps } from "@/lib/utils";
import { getTvq } from "@/lib/utils";
import type { ClientOrder } from "@prisma/client";
import type { ApexOptions } from "apexcharts";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useMemo } from "react";
import Chart from "./chart";
import { chartBgDark, chartBgLight, chartPrimary, chartSecondary } from "./common";
import useAdminStore from "./store";

export default function NetRevenueChart(props: { orders: ClientOrder[] }) {
  const { orders } = props;
  const { setOrders } = useAdminStore();
  const { resolvedTheme } = useTheme();
  const showChartLabels = useMediaQuery(gtMd);
  const t = useTranslations("admin");

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
        name: t("netRevenue"),
        data: revenueSeries.x.map((x, i) => ({ x, y: revenueSeries.y[i] })),
        color: chartPrimary,
      },
    ];
  }, [revenueSeries, t]);

  useEffect(() => {
    setOrders(orders);
  }, [orders]);

  return (
    <Card className="flex flex-col h-0 flex-auto p-3 shadow-none">
      <div className="flex gap-4 flex-wrap">
        <Stat
          name={t("netRevenue")}
          value={cad(revenueSeries.y[revenueSeries.y.length - 1])}
        />
        <Stat name={t("tvq")} value={cad(tvq)} />
        <Stat name={t("tps")} value={cad(tps)} />
        <Stat name={t("shipping")} value={cad(shipping)} />
      </div>
      <div className="flex-auto">
        <Chart options={options} series={series} type="area" height="100%" />
      </div>
    </Card>
  );
}
