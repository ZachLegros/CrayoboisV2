"use client";

import Stat from "@/components/Stat";
import type { ApexOptions } from "apexcharts";
import Chart from "./chart";
import { chartPrimary } from "./common";

export default function Metric(props: {
  name: string;
  data: { x: number; y: number }[];
  currentValue: string;
}) {
  const { name, data, currentValue } = props;

  const options: ApexOptions = {
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
      colors: [chartPrimary],
    },
    fill: {
      opacity: 0.3,
      colors: [chartPrimary],
    },
    yaxis: {
      min: 0,
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  };

  const series: ApexAxisChartSeries = [
    {
      name,
      data,
      color: chartPrimary,
    },
  ];

  return (
    <div className="w-max lg:w-60 overflow-hidden rounded-xl">
      <Stat name={name} value={currentValue} className="p-3" />
      <div className="hidden lg:flex -mb-0.5 h-[80px] w-full">
        <Chart
          options={options}
          series={series}
          type="area"
          height={80}
          width={240}
        />
      </div>
    </div>
  );
}
