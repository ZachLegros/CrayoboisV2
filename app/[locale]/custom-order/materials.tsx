"use client";

import ItemsGrid from "@/components/ItemsGrid";
import ProductComponentCard from "@/components/ProductComponentCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Material } from "@prisma/client";
import { useMemo } from "react";
import NoFilterResult from "./no-filter-result";
import { useCustomOrderStore } from "./store";

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
      {[...Array(12).keys()].map((item) => (
        <Skeleton className="w-full h-[149px] p-3" key={item} />
      ))}
    </ItemsGrid>;
  }

  if (filteredMaterials.length === 0) {
    return <NoFilterResult />;
  }

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
