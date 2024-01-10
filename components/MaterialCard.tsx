"use client";

import { Material } from "@prisma/client";
import { FaEarthAmericas } from "react-icons/fa6";
import { cad } from "@/utils/currencyFormatter";
import ImageWithLoading from "./ImageWithLoading";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export default function MaterialCard(props: { material: Material; onClick: () => void }) {
  const { material, onClick } = props;
  return (
    <Card className="p-3" onClick={onClick}>
      <div className="grid flex-row grid-cols-component-card-sm md:grid-cols-component-card-md lg:grid-cols-component-card-lg gap-4">
        <div className="w-[100px] md:w-[125px] lg:w-[150px]">
          <ImageWithLoading
            width={150}
            height={150}
            src={material.image}
            alt={material.name}
            className="rounded-md max-w-[150px] max-h-[150px]"
            quality={80}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-4 text-lg">
            <b>{material.name}</b>
            <p>{cad(material.price)}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {material.origin !== "Inconnu" && (
              <div className="flex text-sm items-center gap-1">
                <FaEarthAmericas className="flex" />
                <p>{material.origin}</p>
              </div>
            )}
            <Badge variant="default">{material.type}</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
