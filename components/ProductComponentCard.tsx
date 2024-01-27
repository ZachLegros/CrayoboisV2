"use client";

import { cad } from "@/lib/currencyFormatter";
import { isMaterial } from "@/lib/productUtils";
import { Hardware, Material } from "@prisma/client";
import { useTheme } from "next-themes";
import { FaEarthAmericas } from "react-icons/fa6";
import ImageWithLoading from "./ImageWithLoading";
import { Badge } from "./ui/badge";
import { CardInteractive } from "./ui/card";

export default function ProductComponentCard(props: {
  component: Material | Hardware;
  onClick: () => void;
}) {
  const { component, onClick } = props;
  return (
    <CardInteractive className="p-2 md:p-3 relative" onClick={onClick}>
      <div className="flex h-full gap-4">
        <div className="w-[100px] lg:w-[125px] xl:w-[150px]">
          <ImageWithLoading
            width={150}
            height={150}
            src={component.image}
            alt={component.name}
            className="rounded-md min-w-[100px] lg:w-[125px] lg:h-[125px] xl:w-[150px] xl:h-[150px]"
            quality={80}
          />
        </div>
        <div className="flex flex-col flex-grow gap-1">
          <div className="flex justify-between text-sm md:text-md xl:text-lg">
            <b>{component.name}</b>
          </div>
          <div className="flex gap-x-2 gap-y-1 flex-wrap">
            <ComponentDetails component={component} />
          </div>
          <p className="absolute bottom-0 right-0 text-sm md:text-md lg:text-lg p-2 sm:p-3">
            {cad(component.price)}
          </p>
        </div>
      </div>
    </CardInteractive>
  );
}

function ComponentDetails(props: { component: Material | Hardware }) {
  const { theme } = useTheme();
  const { component } = props;

  if (isMaterial(component)) {
    return (
      <>
        {component.origin !== "Inconnu" && (
          <div className="hidden sm:flex text-xs md:text-sm items-center gap-1">
            <FaEarthAmericas />
            <p>{component.origin}</p>
          </div>
        )}
        <Badge
          variant={theme === "dark" ? "default-faded" : "default"}
          className="text-2xs md:text-xs font-bold"
        >
          {component.type}
        </Badge>
      </>
    );
  }

  return (
    <>
      <Badge
        variant={theme === "dark" ? "default-faded" : "default"}
        className="text-2xs md:text-xs font-bold"
      >
        {component.color}
      </Badge>
    </>
  );
}
