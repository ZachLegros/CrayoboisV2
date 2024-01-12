"use client";

import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import useDrawerStore from "@/app/drawer-store";
import useFloatingBarStore from "@/app/floating-bar-store";
import { useCustomOrderStore } from "@/app/custom-order/store";
import { usePathname } from "next/navigation";
import { FaChevronLeft, FaFilter } from "react-icons/fa";

export default function FloatingFilterTrigger(props: { className?: string }) {
  const pathname = usePathname();
  const { className } = props;
  const { onOpenChange } = useDrawerStore();
  const { isOpen } = useFloatingBarStore();
  const { currentStep, setCurrentStep } = useCustomOrderStore();

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "flex w-full items-end fixed bottom-0 left-0 z-50 h-32 bg-gradient-to-t from-background pointer-events-none",
        className
      )}
    >
      {currentStep === 1 && pathname.startsWith("/custom-order") && (
        <Button
          size="lg"
          className="m-3 mb-6 text-lg drop-shadow-lg p-5 pointer-events-auto mr-auto"
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          <FaChevronLeft className="mr-1 text-sm" />
          Retour
        </Button>
      )}
      <Button
        size="lg"
        className="m-3 mb-6 text-lg drop-shadow-lg p-5 pointer-events-auto ml-auto"
        onClick={() => onOpenChange(true)}
      >
        Filtrer
        <FaFilter className="ml-1 text-sm" />
      </Button>
    </div>
  );
}
