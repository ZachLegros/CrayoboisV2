"use client";

import { Button } from "@nextui-org/react";
import { useProductsStore } from "./store";
import Filter from "../../components/Filter";

export default function SidePanel() {
  const { products, priceFilter } = useProductsStore();
  const isDisabled = products.length === 0;

  const handleReset = () => {
    priceFilter.setEnabled(false);
  };

  return (
    <div className="w-72 h-screen overflow-hidden sticky top-0 -mt-[calc(64px+24px+1px)] pt-[calc(64px+24px+1px)]">
      <div className="flex flex-col w-full h-full gap-4 overflow-y-auto overflow-x-hidden pr-2">
        <>
          <div className="flex w-full justify-between items-center pl-2">
            <p className="text-xl font-bold">Filtrer</p>
            <Button
              size="md"
              variant="light"
              color="primary"
              className={`font-bold ${
                priceFilter.enabled && !isDisabled ? "visible" : "invisible"
              }`}
              onClick={handleReset}
            >
              Réinitialiser
            </Button>
          </div>
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
      </div>
    </div>
  );
}
