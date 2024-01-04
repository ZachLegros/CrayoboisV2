"use client";

import { useMemo } from "react";
import ItemsGrid from "@/components/ItemsGrid";
import { useCustomOrderStore } from "./store";
import HardwareCard from "@/components/HardwareCard";
import { Hardware } from "@prisma/client";

export default function Hardwares(props: { onSelect: (hardware: Hardware) => void }) {
  const { onSelect } = props;
  const { hardwares, typeFilter, priceFilter } = useCustomOrderStore();

  const filteredHardwares = useMemo(() => {
    const mats = hardwares.filter((hardware) => {
      if (typeFilter.enabled && typeFilter.value !== "all" && hardware.name !== typeFilter.value)
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

  return (
    <ItemsGrid className="animate-in w-full">
      {filteredHardwares.map((hardware) => (
        <HardwareCard hardware={hardware} key={hardware.id} onClick={() => onSelect(hardware)} />
      ))}
    </ItemsGrid>
  );
}
