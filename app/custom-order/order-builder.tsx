"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useEffect, useState } from "react";
import Materials from "./materials";
import { Hardware, Material } from "@prisma/client";
import { useCustomOrderStore } from "./store";

export default function OrderBuilder(props: { materials: Material[]; hardwares: Hardware[] }) {
  const { materials, hardwares } = props;
  const { setMaterials, setHardwares } = useCustomOrderStore();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setMaterials(materials);
    setHardwares(hardwares);
  }, [materials, hardwares]);

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
