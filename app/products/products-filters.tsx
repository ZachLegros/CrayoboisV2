import Filter from "@/components/Filter";
import { useProductsStore } from "./store";

export default function ProductFilters() {
  const { products, priceFilter } = useProductsStore();
  const isDisabled = products.length === 0;

  return (
    <>
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
        isDisabled={isDisabled}
      />
    </>
  );
}
