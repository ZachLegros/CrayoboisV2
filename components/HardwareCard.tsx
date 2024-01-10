"use client";

import { Hardware } from "@prisma/client";
import { CardBody, Chip } from "@nextui-org/react";
import Card from "@/components/Card";
import { cad } from "@/utils/currencyFormatter";
import ImageWithLoading from "./ImageWithLoading";

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
      <CardBody>
        <div className="grid flex-row grid-cols-component-card-sm md:grid-cols-component-card-md lg:grid-cols-component-card-lg gap-4">
          <div className="w-[100px] md:w-[125px] lg:w-[150px]">
            <ImageWithLoading
              width={150}
              height={150}
              src={hardware.image}
              alt={hardware.name}
              className="rounded-md max-w-[150px] max-h-[150px]"
              quality={80}
            />
          </div>
          <div className="flex flex-auto flex-col gap-2">
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
        </div>
      </CardBody>
    </Card>
  );
}
