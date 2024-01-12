"use client";

import { useEffect, useMemo } from "react";
import ItemsGrid from "@/components/ItemsGrid";
import ProductComponentCard from "@/components/ProductComponentCard";
import { useCustomOrderStore } from "./store";
import { Material } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Materials(props: {
  onSelect: (material: Material) => void;
}) {
  const { onSelect } = props;
  const { materials, typeFilter, originFilter, priceFilter } = useCustomOrderStore();

  const filteredMaterials = useMemo(() => {
    const mats = materials.filter((material) => {
      if (
        typeFilter.enabled &&
        typeFilter.value !== "all" &&
        material.type !== typeFilter.value
      )
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

  if (filteredMaterials.length === 0) {
    <ItemsGrid className="w-full h-full">
      {[...Array(12).keys()].map((_, index) => (
        <Skeleton className="w-full h-[149px] p-3" key={index} />
      ))}
    </ItemsGrid>;
  }

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [materials, typeFilter, priceFilter, originFilter]);

  return (
    <ItemsGrid className="w-full">
      {filteredMaterials.map((material) => (
        <ProductComponentCard
          component={material}
          key={material.id}
          onClick={() => onSelect(material)}
        />
      ))}
    </ItemsGrid>
  );
}
