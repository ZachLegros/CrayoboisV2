"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useState } from "react";
import Materials from "./materials";
import { Hardware, Material } from "@prisma/client";

export default function OrderBuilder(props: { materials: Material[]; hardwares: Hardware[] }) {
  const { materials } = props;
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <div className="flex flex-col w-full gap-4">
      <Breadcrumbs
        steps={["Choix du bois", "Choix du matériel", "Passer la commande"]}
        currentStep={currentStep}
        onAction={setCurrentStep}
      />
      {currentStep === 0 && <Materials materials={materials} />}
    </div>
  );
}
