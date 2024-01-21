"use client";

import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { dayjs } from "@/lib/utils";
import { primaryColor } from "./common";

export default function Metric(props: {
  name: string;
  data: { x: number; y: number }[];
  currentValue: string;
}) {
  const { name, data, currentValue } = props;
  const { resolvedTheme } = useTheme();
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
      name,
      data,
      color: primaryColor,
    },
  ];

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <Card className="p-2 max-w-60">
      <h3 className="text-foreground/70 font-medium">{name}</h3>
      <h1 className="text-xl font-semibold mb-2">{currentValue}</h1>
      <Chart options={options} series={series} type="area" height={80} />
    </Card>
  );
}
