"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import FloatingBar from "@/components/FloatingBar";
import FloatingFilterTrigger from "@/components/FloatingFilterTrigger";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/hooks";
import { gtMd } from "@/lib/mediaQueries";
import { customProductFactory } from "@/lib/productUtils";
import type { Hardware, Material } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useCartStore } from "../cart/store";
import AddedToCart from "./added-to-cart";
import HardwareFilters from "./hardware-filters";
import Hardwares from "./hardwares";
import MaterialFilters from "./material-filters";
import Materials from "./materials";
import { useCustomOrderStore } from "./store";

export default function OrderBuilder(props: {
  materials: Material[];
  hardwares: Hardware[];
}) {
  const { materials, hardwares } = props;
  const { cart } = useCartStore();
  const {
    currentStep,
    setCurrentStep,
    reset,
    setMaterials,
    setHardwares,
    selectMaterial,
    selectHardware,
    selectedMaterial,
  } = useCustomOrderStore();
  const isLargeScreen = useMediaQuery(gtMd);
  const t = useTranslations("customOrder");

  const handleaddItem = (material: Material, hardware: Hardware) => {
    const customProduct = customProductFactory(material, hardware);
    cart.addItem(customProduct);
    setCurrentStep(currentStep + 1);
  };

  useLayoutEffect(() => {
    if (currentStep === 2) reset();
  }, []);

  useEffect(() => {
    setMaterials(materials);
    setHardwares(hardwares);
  }, [materials, hardwares]);

  return (
    <>
      {currentStep < 2 && (
        <Breadcrumbs
          className="hidden bg-card border h-8 px-3 rounded-md sm:flex sm:w-full sm:justify-between sm:items-center md:w-max"
          steps={[t("woodChoice"), t("hardwareChoice"), t("addToCartStep")]}
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
          <p className="flex sm:hidden text-xl font-semibold">{t("woodChoice")}</p>
          <Materials
            onSelect={(material) => {
              setCurrentStep(currentStep + 1);
              selectMaterial(material);
            }}
          />
          <FloatingBar className="flex md:hidden">
            <Drawer>
              <DrawerTrigger className="ml-auto" asChild>
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
          <p className="flex sm:hidden text-xl font-semibold">
            {t("hardwareChoice")}
          </p>
          <Hardwares
            onSelect={(hardware) => {
              if (!selectedMaterial || !hardware) return; // error
              handleaddItem(selectedMaterial, hardware);
            }}
          />
          <FloatingBar className="flex md:hidden">
            <Button
              size="lg"
              className="m-3 mb-6 text-lg drop-shadow-lg p-4 pointer-events-auto mr-auto"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <FaChevronLeft className="mr-1 text-sm" />
              {t("back")}
            </Button>
            <Drawer>
              <DrawerTrigger className="ml-auto" asChild>
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
        <div className="flex flex-col flex-auto items-center justify-center md:justify-start">
          <AddedToCart />
          {!isLargeScreen && (
            <Drawer open={true}>
              <DrawerContent className="min-h-max p-3 mb-6">
                <AddedToCart />
              </DrawerContent>
            </Drawer>
          )}
        </div>
      )}
    </>
  );
}
