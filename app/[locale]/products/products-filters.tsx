import Filter from "@/components/Filter";
import { useEffect } from "react";
import type { PriceFilterValue } from "../custom-order/store";
import { useProductsStore } from "./store";

export default function ProductFilters() {
  const { products, priceFilter } = useProductsStore();
  const isDisabled = products.length === 0;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [products, priceFilter]);

  return (
    <>
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
        isDisabled={isDisabled}
      />
    </>
  );
}
