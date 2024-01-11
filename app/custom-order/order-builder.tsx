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
import { useToast } from "@/components/ui/use-toast";

export default function OrderBuilder(props: {
  materials: Material[];
  hardwares: Hardware[];
}) {
  const { materials, hardwares } = props;
  const { toast } = useToast();
  const { addToCart } = useCartStore();
  const {
    currentStep,
    setCurrentStep,
    setMaterials,
    setHardwares,
    selectMaterial,
    // selectHardware,
    selectedMaterial,
  } = useCustomOrderStore();

  const handleAddToCart = (material: Material, hardware: Hardware) => {
    const customProduct = customProductFactory(material, hardware);
    addToCart(customProduct);
    setCurrentStep(currentStep + 1);
    toast({ title: "Votre produit a été ajouté au panier" });
  };

  useEffect(() => {
    setMaterials(materials);
    setHardwares(hardwares);
  }, [materials, hardwares]);

  return (
    <div className="flex flex-col w-full gap-4">
      {/* {currentStep < 2 && (
        <Breadcrumbs
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
      )} */}
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
    </div>
  );
}
