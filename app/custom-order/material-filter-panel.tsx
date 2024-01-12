"use client";

import React, { useMemo } from "react";
import { useCustomOrderStore } from "./store";
import Filter from "../../components/Filter";
import { Button, ButtonProps } from "@/components/ui/button";

export function ResetButton(props: ButtonProps) {
  return (
    <Button variant="outline" size="sm" {...props}>
      Réinitialiser
    </Button>
  );
}

export default function MaterialFilterPanel() {
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
