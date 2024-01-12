"use client";

import { useEffect, useMemo } from "react";
import ItemsGrid from "@/components/ItemsGrid";
import { useCustomOrderStore } from "./store";
import ProductComponentCard from "@/components/ProductComponentCard";
import { Hardware } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

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

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [hardwares, typeFilter, priceFilter]);

  if (filteredHardwares.length === 0) {
    <ItemsGrid className="w-full h-full">
      {[...Array(12).keys()].map((_, index) => (
        <Skeleton className="w-full h-[149px] p-3" key={index} />
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
