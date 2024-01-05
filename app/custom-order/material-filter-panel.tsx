"use client";

import React, { useMemo } from "react";
import { Button } from "@nextui-org/react";
import { useCustomOrderStore } from "./store";
import Filter from "../../components/Filter";

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
    <>
      <div className="flex w-full justify-between items-center pl-2">
        <p className="text-xl font-bold">Filtrer</p>
        <Button
          size="md"
          variant="light"
          color="primary"
          className={`font-bold ${
            typeFilter.enabled || originFilter.enabled || priceFilter.enabled
              ? "visible"
              : "invisible"
          }`}
          onClick={handleReset}
        >
          Réinitialiser
        </Button>
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
    </>
  );
}
