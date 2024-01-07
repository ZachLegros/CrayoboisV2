"use client";

import { Material } from "@prisma/client";
import { Card, CardBody, Chip } from "@nextui-org/react";
import { FaEarthAmericas } from "react-icons/fa6";
import { cad } from "@/utils/currencyFormatter";
import ImageWithLoading from "./ImageWithLoading";

export default function MaterialCard(props: { material: Material; onClick: () => void }) {
  const { material, onClick } = props;
  return (
    <Card
      shadow="sm"
      className="bg-background/60 dark:bg-default-100/50 "
      onPress={onClick}
      isPressable
      isHoverable
    >
      <CardBody className="flex flex-row gap-4">
        <ImageWithLoading
          width={150}
          height={150}
          src={material.image}
          alt={material.name}
          className="rounded-md max-w-[150px] max-h-[150px]"
          quality={80}
        />
        <div className="flex flex-auto flex-col gap-2">
          <div className="flex justify-between gap-4 text-lg">
            <b>{material.name}</b>
            <p>{cad(material.price)}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex text-sm items-center gap-1">
              <FaEarthAmericas className="flex" />
              <p>{material.origin}</p>
            </div>
            {/* <p>•</p> */}
            <Chip radius="sm" size="sm" variant="flat" color="warning">
              {material.type}
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
