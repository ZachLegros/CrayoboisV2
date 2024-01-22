"use client";

import type { Props as ApexChartProps } from "react-apexcharts";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Chart(props: ApexChartProps) {
  const { ...chartProps } = props;
  const ApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
    loading: () => (
      <Skeleton className="flex justify-center items-center w-full h-full rounded-none">
        <Spinner />
      </Skeleton>
    ),
  });

  return <ApexChart {...chartProps} />;
}
