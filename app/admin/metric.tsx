"use client";

import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { chartPrimary } from "./common";
import { useMediaQuery } from "@uidotdev/usehooks";
import { gtMd } from "@/lib/mediaQueries";
import Stat from "@/components/Stat";

export default function Metric(props: {
  name: string;
  data: { x: number; y: number }[];
  currentValue: string;
}) {
  const { name, data, currentValue } = props;
  const displayChart = useMediaQuery(gtMd);

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

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div className="max-w-60 overflow-hidden rounded-xl">
      <Stat name={name} value={currentValue} className="p-3" />
      {displayChart && (
        <div className="-mb-0.5">
          <Chart options={options} series={series} type="area" height={80} />
        </div>
      )}
    </div>
  );
}
