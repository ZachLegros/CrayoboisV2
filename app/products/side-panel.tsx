"use client";

import { useProductsStore } from "./store";
import { ResetButton } from "../custom-order/material-filter-panel";
import { cn } from "@/lib/utils";
import ProductFilters from "./products-filters";
import FloatingBar from "@/components/FloatingBar";
import FloatingFilterTrigger from "@/components/FloatingFilterTrigger";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";

export default function SidePanel(props: { className?: string }) {
  const { className } = props;
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
      <ProductFilters />
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
        {products.length > 0 && (
          <FloatingBar className="flex md:hidden">
            <Drawer>
              <DrawerTrigger className="ml-auto">
                <FloatingFilterTrigger />
              </DrawerTrigger>
              <DrawerContent className="p-3 space-y-4">
                <ProductFilters />
              </DrawerContent>
            </Drawer>
          </FloatingBar>
        )}
      </div>
    </div>
  );
}
