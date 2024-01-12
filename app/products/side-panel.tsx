"use client";

import { useProductsStore } from "./store";
import Filter from "../../components/Filter";
import { ResetButton } from "../custom-order/material-filter-panel";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import useDrawerStore from "../drawer-store";

export default function SidePanel(props: { className?: string }) {
  const { className } = props;
  const { isOpen, onOpenChange } = useDrawerStore();
  const { products, priceFilter } = useProductsStore();
  const isDisabled = products.length === 0;

  const handleReset = () => {
    priceFilter.setEnabled(false);
  };

  const panelContent = (
    <>
      <div className="flex w-full justify-between items-center pl-2">
        <p className="text-xl font-bold">Filtrer</p>
        <ResetButton
          className={`font-semibold ${
            priceFilter.enabled && !isDisabled ? "visible" : "invisible"
          }`}
          onClick={handleReset}
        >
          Réinitialiser
        </ResetButton>
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
  );

  return (
    <div
      className={cn(
        "w-52 lg:w-64 h-screen overflow-hidden sticky top-0 -mt-[calc(64px+24px+1px)] pt-[calc(64px+24px+1px)]",
        className
      )}
    >
      <div className="flex flex-col w-full h-full gap-4 overflow-y-auto overflow-x-hidden pr-2">
        {panelContent}
        {isOpen && (
          <Drawer open={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="h-96 p-3 space-y-4">
              {panelContent}
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
}
