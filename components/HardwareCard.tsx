"use client";

import { Hardware } from "@prisma/client";
import { Card, CardBody, Chip } from "@nextui-org/react";
import Image from "next/image";
import { cad } from "@/utils/currencyFormatter";

export default function HardwareCard(props: { hardware: Hardware; onClick: () => void }) {
  const { hardware, onClick } = props;
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
          src={hardware.image}
          alt={hardware.name}
          className="rounded-md object-contain self-start"
          loading="lazy"
        />
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex justify-between gap-4 text-lg">
            <b>{hardware.name}</b>
            <p>{cad(hardware.price)}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Chip radius="sm" size="sm" variant="flat" color="warning">
              {hardware.color}
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
