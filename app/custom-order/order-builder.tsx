"use client";

import { useEffect } from "react";
import type { Hardware, Material } from "@prisma/client";
import Materials from "./materials";
import Hardwares from "./hardwares";
import { useCustomOrderStore } from "./store";
import { useCartStore } from "../cart/store";
import { customProductFactory } from "@/lib/productUtils";
import AddedToCart from "./added-to-cart";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import FloatingBar from "@/components/FloatingBar";
import FloatingFilterTrigger from "@/components/FloatingFilterTrigger";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import HardwareFilters from "./hardware-filters";
import MaterialFilters from "./material-filters";
import { Button } from "@/components/ui/button";
import { FaChevronLeft } from "react-icons/fa";
import { useMediaQuery } from "@uidotdev/usehooks";
import { gtMd } from "@/lib/mediaQueries";

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
  const isLargeScreen = useMediaQuery(gtMd);

  const handleAddToCart = (material: Material, hardware: Hardware) => {
    const customProduct = customProductFactory(material, hardware);
    addToCart(customProduct);
    setCurrentStep(currentStep + 1);
  };

  useEffect(() => {
    setMaterials(materials);
    setHardwares(hardwares);
  }, [materials, hardwares]);

  return (
    <>
      {currentStep < 2 && (
        <Breadcrumbs
          className="hidden bg-card border h-8 px-3 rounded-md sm:flex sm:w-full sm:justify-between sm:items-center md:w-max"
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
        <>
          <Materials
            onSelect={(material) => {
              setCurrentStep(currentStep + 1);
              selectMaterial(material);
            }}
          />
          <FloatingBar className="flex md:hidden">
            <Drawer>
              <DrawerTrigger className="ml-auto">
                <FloatingFilterTrigger />
              </DrawerTrigger>
              <DrawerContent className="h-[625px] p-3 space-y-4">
                <MaterialFilters />
              </DrawerContent>
            </Drawer>
          </FloatingBar>
        </>
      )}
      {currentStep === 1 && (
        <>
          <Hardwares
            onSelect={(hardware) => {
              if (!selectedMaterial || !hardware) return; // error
              handleAddToCart(selectedMaterial, hardware);
            }}
          />
          <FloatingBar className="flex md:hidden">
            <Button
              size="lg"
              className="m-3 mb-6 text-lg drop-shadow-lg p-4 pointer-events-auto mr-auto"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <FaChevronLeft className="mr-1 text-sm" />
              Retour
            </Button>
            <Drawer>
              <DrawerTrigger className="ml-auto">
                <FloatingFilterTrigger />
              </DrawerTrigger>
              <DrawerContent className="h-[625px] p-3 space-y-4">
                <HardwareFilters />
              </DrawerContent>
            </Drawer>
          </FloatingBar>
        </>
      )}
      {currentStep === 2 && (
        <>
          <AddedToCart />
          {!isLargeScreen && (
            <Drawer open={true}>
              <DrawerContent className="p-3 mb-8">
                <AddedToCart />
              </DrawerContent>
            </Drawer>
          )}
        </>
      )}
    </>
  );
}
