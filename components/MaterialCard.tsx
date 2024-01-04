"use client";

import { Material } from "@prisma/client";
import { Card, CardBody, Chip } from "@nextui-org/react";
import Image from "next/image";
import { FaEarthAmericas } from "react-icons/fa6";
import { cad } from "@/utils/currencyFormatter";

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
        <Image
          width={150}
          height={150}
          src={material.image}
          alt={material.name}
          className="rounded-md object-contain self-start"
          loading="lazy"
        />
        <div className="flex flex-1 flex-col gap-2">
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
