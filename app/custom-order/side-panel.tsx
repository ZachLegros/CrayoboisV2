"use client";

import { useMemo, useState } from "react";
import { Button, Radio, RadioGroup, Checkbox } from "@nextui-org/react";
import { useCustomOrderStore } from "./store";

export default function SidePanel() {
  const {
    materials,
    clearFilters,
    originFilter,
    setOriginFilter,
    typeFilter,
    setTypeFilter,
    clearTypeFilter,
    clearOriginFilter,
  } = useCustomOrderStore();
  const [typeFilterEnabled, setTypeFilterEnabled] = useState(true);
  const [originFilterEnabled, setOriginFilterEnabled] = useState(false);

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

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex w-full justify-between items-center">
        <p className="text-xl font-bold">Filtrer</p>
        <Button
          size="sm"
          variant="light"
          color="primary"
          className="font-bold"
          onClick={clearFilters}
        >
          Réinitialiser
        </Button>
      </div>
      <div className="flex flex-col w-full gap-2">
        <div className="flex w-full justify-between">
          <p className="text-xl font-bold text-gray-400">Par type</p>
          <Checkbox
            isSelected={typeFilterEnabled}
            onValueChange={(isSelected) => {
              setTypeFilterEnabled(isSelected);
              if (!isSelected) clearTypeFilter();
            }}
            isIndeterminate={typeFilterEnabled}
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <RadioGroup size="md" value={typeFilter} onValueChange={setTypeFilter}>
            <Radio color="primary" value={"all"}>
              Tous les types ({materials.length})
            </Radio>
            {Object.keys(materialTypes)
              .sort()
              .map((type) => (
                <Radio key={type} color="primary" value={type}>
                  {type} ({materialTypes[type]})
                </Radio>
              ))}
          </RadioGroup>
        </div>
      </div>
      <div className="flex flex-col w-full gap-2">
        <div className="flex w-full justify-between">
          <p className="text-xl font-bold text-gray-400">Par origine</p>
          <Checkbox
            isSelected={originFilterEnabled}
            onValueChange={(isSelected) => {
              setOriginFilterEnabled(isSelected);
              if (!isSelected) clearOriginFilter();
            }}
            isIndeterminate={originFilterEnabled}
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <RadioGroup size="md" value={originFilter} onValueChange={setOriginFilter}>
            <Radio color="primary" value="all">
              Tous les origines ({materials.length})
            </Radio>
            {Object.keys(materialOrigins)
              .sort()
              .map((origin) => (
                <Radio key={origin} color="primary" value={origin}>
                  {origin} ({materialOrigins[origin]})
                </Radio>
              ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
