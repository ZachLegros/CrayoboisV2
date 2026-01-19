import Filter from "@/components/Filter";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { type PriceFilterValue, useCustomOrderStore } from "./store";

export default function HardwareFilters(props: { className?: string }) {
  const { className } = props;
  const { hardwares, typeFilter, priceFilter } = useCustomOrderStore();
  const t = useTranslations("filters");

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
        filterName={t("byType")}
        filterValues={[
          { value: "all", label: t("allTypes"), amount: hardwares.length },
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
        filterName={t("byPrice")}
        filterValues={[
          { value: "desc", label: t("priceDescending") },
          { value: "asc", label: t("priceAscending") },
        ]}
        currentValue={priceFilter.value}
        setValue={(value) => priceFilter.setValue(value as PriceFilterValue)}
        filterEnabled={priceFilter.enabled}
        setFilterEnabled={priceFilter.setEnabled}
      />
    </div>
  );
}
