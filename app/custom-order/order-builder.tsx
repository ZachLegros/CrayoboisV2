"use client";

import { useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Hardware, Material } from "@prisma/client";
import Materials from "./materials";
import { useCustomOrderStore } from "./store";
import Hardwares from "./hardwares";

export default function OrderBuilder(props: { materials: Material[]; hardwares: Hardware[] }) {
  const { materials, hardwares } = props;
  const {
    currentStep,
    setCurrentStep,
    setMaterials,
    setHardwares,
    selectMaterial,
    selectHardware,
  } = useCustomOrderStore();

  useEffect(() => {
    setMaterials(materials);
    setHardwares(hardwares);
  }, [materials, hardwares]);

  return (
    <div className="flex flex-col w-full gap-4">
      <Breadcrumbs
        steps={["Choix du bois", "Choix du matériel", "Passer la commande"]}
        currentStep={currentStep}
        onAction={(stepIndex) => {
          if (stepIndex === 0) {
            selectMaterial(null);
            selectHardware(null);
          }
          if (stepIndex === 1) {
            selectHardware(null);
          }
          setCurrentStep(stepIndex);
        }}
      />
      {currentStep === 0 && (
        <Materials
          onSelect={(materialId) => {
            setCurrentStep(currentStep + 1);
            selectMaterial(materialId);
          }}
        />
      )}
      {currentStep === 1 && (
        <Hardwares
          onSelect={(hardwareId) => {
            setCurrentStep(currentStep + 1);
            selectHardware(hardwareId);
          }}
        />
      )}
    </div>
  );
}
