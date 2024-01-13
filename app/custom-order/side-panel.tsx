"use client";

import { cn } from "@/lib/utils";
import HardwareFilterPanel from "./hardware-filter-panel";
import MaterialFilterPanel from "./material-filter-panel";
import { useCustomOrderStore } from "./store";

export default function SidePanel(props: { className?: string }) {
  const { className } = props;
  const { currentStep } = useCustomOrderStore();

  const panelContent = (
    <>
      {currentStep === 0 && <MaterialFilterPanel />}
      {currentStep === 1 && <HardwareFilterPanel />}
    </>
  );

  return (
    <div
      className={cn(
        "h-max sticky top-0 -mt-[calc(4rem+1.5rem+1px)] pt-[calc(4rem+1.5rem+1px)]",
        className
      )}
    >
      <div className="hidden md:flex w-full h-[calc(100vh-4rem-1.5rem-1px)] overflow-y-auto pr-3">
        {panelContent}
      </div>
    </div>
  );
}
