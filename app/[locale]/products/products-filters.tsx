import Filter from "@/components/Filter";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import type { PriceFilterValue } from "../custom-order/store";
import { useProductsStore } from "./store";

export default function ProductFilters() {
  const { products, priceFilter } = useProductsStore();
  const isDisabled = products.length === 0;
  const t = useTranslations("filters");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [products, priceFilter]);

  return (
    <>
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
        isDisabled={isDisabled}
      />
    </>
  );
}
