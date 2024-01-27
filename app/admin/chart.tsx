"use client";

import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";
import type { Props as ApexChartProps } from "react-apexcharts";

export default function Chart(props: ApexChartProps) {
  const { ...chartProps } = props;
  const ApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center w-full h-full rounded-none">
        <Spinner />
      </div>
    ),
  });

  return <ApexChart {...chartProps} />;
}
