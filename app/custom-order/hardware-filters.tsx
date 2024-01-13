import Filter from "@/components/Filter";
import { useCustomOrderStore } from "./store";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export default function HardwareFilters(props: { className?: string }) {
  const { className } = props;
  const { hardwares, typeFilter, priceFilter } = useCustomOrderStore();

  const hardwareTypes: { [type: string]: number } = useMemo(() => {
    return hardwares.reduce((acc, hardware) => {
      acc[hardware.name] = acc[hardware.name] ? acc[hardware.name] + 1 : 1;
      return acc;
    }, {} as any);
  }, [hardwares]);

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
        setValue={priceFilter.setValue}
        filterEnabled={priceFilter.enabled}
        setFilterEnabled={priceFilter.setEnabled}
      />
    </div>
  );
}
