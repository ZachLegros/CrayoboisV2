"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import MaterialFilters from "./material-filters";
import { useCustomOrderStore } from "./store";

export function ResetButton(props: ButtonProps) {
  return (
    <Button variant="outline" size="sm" {...props}>
      Réinitialiser
    </Button>
  );
}

export default function MaterialFilterPanel() {
  const { originFilter, typeFilter, priceFilter } = useCustomOrderStore();

  const handleReset = () => {
    typeFilter.setEnabled(true);
    originFilter.setEnabled(false);
    priceFilter.setEnabled(false);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto gap-4">
      <div className="flex w-full justify-between items-center pl-2">
        <p className="text-xl font-bold">Filtrer</p>
        <ResetButton
          className={`${
            typeFilter.enabled || originFilter.enabled || priceFilter.enabled
              ? "visible"
              : "invisible"
          }`}
          onClick={handleReset}
        />
      </div>
      <MaterialFilters />
    </div>
  );
}
