import Filter from "@/components/Filter";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";
import { PriceFilterValue, useCustomOrderStore } from "./store";

export default function HardwareFilters(props: { className?: string }) {
  const { className } = props;
  const { hardwares, typeFilter, priceFilter } = useCustomOrderStore();

  const hardwareTypes: { [type: string]: number } = useMemo(() => {
    return hardwares.reduce(
      (acc, hardware) => {
        acc[hardware.name] = acc[hardware.name] ? acc[hardware.name] + 1 : 1;
        return acc;
      },
      {} as { [type: string]: number },
    );
  }, [hardwares]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [hardwares, typeFilter, priceFilter]);

  return (
    <div className={cn("flex flex-col gap-2 overflow-y-auto", className)}>
      <Filter
        filterName="Par type"
        filterValues={[
          { value: "all", label: "Tous les types", amount: hardwares.length },
          ...Object.keys(hardwareTypes).map((type) => ({
            value: type,
            label: type,
            amount: hardwareTypes[type],
          })),
        ]}
        currentValue={typeFilter.value}
        setValue={typeFilter.setValue}
        filterEnabled={typeFilter.enabled}
        setFilterEnabled={typeFilter.setEnabled}
      />
      <Filter
        filterName="Par prix"
        filterValues={[
          { value: "desc", label: "Prix descendant" },
          { value: "asc", label: "Prix ascendant" },
        ]}
        currentValue={priceFilter.value}
        setValue={(value) => priceFilter.setValue(value as PriceFilterValue)}
        filterEnabled={priceFilter.enabled}
        setFilterEnabled={priceFilter.setEnabled}
      />
    </div>
  );
}
