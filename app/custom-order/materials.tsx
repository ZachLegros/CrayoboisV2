"use client";

import { useMemo } from "react";
import ItemsGrid from "@/components/ItemsGrid";
import MaterialCard from "@/components/MaterialCard";
import { useCustomOrderStore } from "./store";
import { Material } from "@prisma/client";

export default function Materials(props: { onSelect: (material: Material) => void }) {
  const { onSelect } = props;
  const { materials, typeFilter, originFilter, priceFilter } = useCustomOrderStore();

  const filteredMaterials = useMemo(() => {
    const mats = materials.filter((material) => {
      if (typeFilter.enabled && typeFilter.value !== "all" && material.type !== typeFilter.value)
        return false;
      if (
        originFilter.enabled &&
        originFilter.value !== "all" &&
        material.origin !== originFilter.value
      )
        return false;
      return true;
    });

    if (priceFilter.enabled) {
      mats.sort((a, b) => {
        if (priceFilter.value === "asc") return a.price - b.price;
        if (priceFilter.value === "desc") return b.price - a.price;
        return 0;
      });
    }

    return mats;
  }, [materials, typeFilter, priceFilter, originFilter]);

  return (
    <ItemsGrid className="animate-in w-full">
      {filteredMaterials.map((material) => (
        <MaterialCard material={material} key={material.id} onClick={() => onSelect(material)} />
      ))}
    </ItemsGrid>
  );
}
