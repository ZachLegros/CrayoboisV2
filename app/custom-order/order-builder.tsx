"use client";

import { useEffect } from "react";
// import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Hardware, Material } from "@prisma/client";
import Materials from "./materials";
import { useCustomOrderStore } from "./store";
import Hardwares from "./hardwares";
import { useCartStore } from "../cart/store";
import { customProductFactory } from "@/utils/productUtils";
import AddedToCart from "./added-to-cart";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import useFloatingBarStore from "../floating-bar-store";

export default function OrderBuilder(props: {
  materials: Material[];
  hardwares: Hardware[];
}) {
  const { materials, hardwares } = props;
  const { addToCart } = useCartStore();
  const {
    currentStep,
    setCurrentStep,
    setMaterials,
    setHardwares,
    selectMaterial,
    selectHardware,
    selectedMaterial,
  } = useCustomOrderStore();
  const { onOpenChange } = useFloatingBarStore();

  const handleAddToCart = (material: Material, hardware: Hardware) => {
    const customProduct = customProductFactory(material, hardware);
    addToCart(customProduct);
    setCurrentStep(currentStep + 1);
    onOpenChange(false);
  };

  useEffect(() => {
    setMaterials(materials);
    setHardwares(hardwares);
    onOpenChange(true);
  }, [materials, hardwares]);

  return (
    <>
      {currentStep < 2 && (
        <Breadcrumbs
          className="hidden sm:flex"
          steps={["Choix du bois", "Choix du matériel", "Ajouter au panier"]}
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
      )}
      {currentStep === 0 && (
        <Materials
          onSelect={(material) => {
            setCurrentStep(currentStep + 1);
            selectMaterial(material);
          }}
        />
      )}
      {currentStep === 1 && (
        <Hardwares
          onSelect={(hardware) => {
            if (!selectedMaterial || !hardware) return; // error
            handleAddToCart(selectedMaterial, hardware);
          }}
        />
      )}
      {currentStep === 2 && <AddedToCart />}
    </>
  );
}
