"use client";

import React, { useMemo } from "react";
import { useCustomOrderStore } from "./store";
import Filter from "../../components/Filter";
import { Button } from "@/components/ui/button";

export default function HardwareFilterPanel(props: { isDisabled?: boolean }) {
  const { isDisabled } = props;
  const { hardwares, typeFilter, priceFilter } = useCustomOrderStore();

  const hardwareTypes: { [type: string]: number } = useMemo(() => {
    return hardwares.reduce((acc, hardware) => {
      acc[hardware.name] = acc[hardware.name] ? acc[hardware.name] + 1 : 1;
      return acc;
    }, {} as any);
  }, [hardwares]);

  const handleReset = () => {
    typeFilter.setEnabled(true);
    priceFilter.setEnabled(false);
  };

  return (
    <div
      className={
        isDisabled ? "flex flex-col gap-4 pointer-events-none opacity-50" : "flex flex-col gap-4"
      }
    >
      <div className="flex w-full justify-between items-center pl-2">
        <p className="text-xl font-bold">Filtrer</p>
        <Button
          variant="secondary"
          className={`font-semibold ${
            typeFilter.enabled || priceFilter.enabled ? "visible" : "invisible"
          }`}
          onClick={handleReset}
        >
          Réinitialiser
        </Button>
      </div>
      <Filter
        filterName="Par type"
        filterValues={[
          { value: "all", label: "Tous les types", amount: hardwares.length },
          ...Object.keys(hardwareTypes).map((type) => ({
            value: type,
            label: type,
            amount: hardwareTypes[type],
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
    </div>
  );
}
