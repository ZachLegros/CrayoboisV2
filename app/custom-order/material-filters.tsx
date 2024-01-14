import Filter from "@/components/Filter";
import { useCustomOrderStore } from "./store";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function MaterialFilters(props: { className?: string }) {
  const { className } = props;
  const { materials, originFilter, typeFilter, priceFilter } = useCustomOrderStore();

  const materialTypes: { [type: string]: number } = useMemo(() => {
    return materials.reduce((acc, material) => {
      acc[material.type] = acc[material.type] ? acc[material.type] + 1 : 1;
      return acc;
    }, {} as any);
  }, [materials]);

  const materialOrigins = useMemo(() => {
    return materials.reduce((acc, material) => {
      acc[material.origin] = acc[material.origin] ? acc[material.origin] + 1 : 1;
      return acc;
    }, {} as any);
  }, [materials]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [materials, originFilter, typeFilter, priceFilter]);

  return (
    <div className={cn("flex flex-col gap-2 overflow-y-auto", className)}>
      <Filter
        filterName="Par type"
        filterValues={[
          { value: "all", label: "Tous les types", amount: materials.length },
          ...Object.keys(materialTypes).map((type) => ({
            value: type,
            label: type,
            amount: materialTypes[type],
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
      <Filter
        filterName="Par origine"
        filterValues={[
          { value: "all", label: "Toutes les origines", amount: materials.length },
          ...Object.keys(materialOrigins).map((origin) => ({
            value: origin,
            label: origin,
            amount: materialOrigins[origin],
          })),
        ]}
        currentValue={originFilter.value}
        setValue={originFilter.setValue}
        filterEnabled={originFilter.enabled}
        setFilterEnabled={originFilter.setEnabled}
      />
    </div>
  );
}
