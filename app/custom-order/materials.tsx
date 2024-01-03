"use client";

import ItemsGrid from "@/components/ItemsGrid";
import MaterialCard from "@/components/MaterialCard";
import { Material } from "@prisma/client";

export default function Materials(props: { materials: Material[] }) {
  const { materials } = props;

  return (
    <ItemsGrid className="animate-in">
      {materials.map((material) => (
        <MaterialCard material={material} key={material.id} />
      ))}
    </ItemsGrid>
  );
}
