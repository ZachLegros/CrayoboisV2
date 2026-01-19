"use client";

import FloatingBar from "@/components/FloatingBar";
import FloatingFilterTrigger from "@/components/FloatingFilterTrigger";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ResetButton } from "../custom-order/material-filter-panel";
import ProductFilters from "./products-filters";
import { useProductsStore } from "./store";

export default function SidePanel(props: { className?: string }) {
  const { className } = props;
  const { products, priceFilter } = useProductsStore();
  const isDisabled = products.length === 0;
  const t = useTranslations("filters");

  const handleReset = () => {
    priceFilter.setEnabled(false);
  };

  const panelContent = (
    <>
      <div className="flex w-full justify-between items-center pl-2">
        <p className="text-xl font-bold">{t("filter")}</p>
        <ResetButton
          className={`font-semibold ${
            priceFilter.enabled && !isDisabled ? "visible" : "invisible"
          }`}
          onClick={handleReset}
        >
          {t("reset")}
        </ResetButton>
      </div>
      <ProductFilters />
    </>
  );

  return (
    <div
      className={cn(
        "w-52 lg:w-64 h-screen overflow-hidden sticky top-0 -mt-[calc(64px+24px+1px)] pt-[calc(64px+24px+1px)]",
        className,
      )}
    >
      <div className="flex flex-col w-full h-full gap-4 overflow-y-auto overflow-x-hidden pr-2">
        {panelContent}
        {products.length > 0 && (
          <FloatingBar className="flex md:hidden">
            <Drawer>
              <DrawerTrigger className="ml-auto" asChild>
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
