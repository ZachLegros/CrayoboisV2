"use client";

import ItemsGrid from "@/components/ItemsGrid";
import ProductComponentCard from "@/components/ProductComponentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Hardware } from "@prisma/client";
import { useMemo } from "react";
import { useCustomOrderStore } from "./store";

export default function Hardwares(props: {
  onSelect: (hardware: Hardware) => void;
}) {
  const { onSelect } = props;
  const { hardwares, typeFilter, priceFilter } = useCustomOrderStore();

  const filteredHardwares = useMemo(() => {
    const mats = hardwares.filter((hardware) => {
      if (
        typeFilter.enabled &&
        typeFilter.value !== "all" &&
        hardware.name !== typeFilter.value
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
  }, [hardwares, typeFilter, priceFilter]);

  if (filteredHardwares.length === 0) {
    <ItemsGrid className="w-full h-full">
      {[...Array(12).keys()].map((item) => (
        <Skeleton className="w-full h-[149px] p-3" key={item} />
      ))}
    </ItemsGrid>;
  }

  return (
    <ItemsGrid className="w-full">
      {filteredHardwares.map((hardware) => (
        <ProductComponentCard
          component={hardware}
          key={hardware.id}
          onClick={() => onSelect(hardware)}
        />
      ))}
    </ItemsGrid>
  );
}
