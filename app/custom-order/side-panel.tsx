"use client";

import HardwareFilterPanel from "./hardware-filter-panel";
import MaterialFilterPanel from "./material-filter-panel";
import { useCustomOrderStore } from "./store";

export default function SidePanel() {
  const { currentStep } = useCustomOrderStore();

  return (
    <div className="w-72 h-screen overflow-hidden sticky top-0 -mt-[calc(64px+24px+1px)] pt-[calc(64px+24px+1px)]">
      <div className="flex flex-col w-full h-full gap-4 overflow-y-auto overflow-x-hidden pr-2">
        {currentStep === 0 && <MaterialFilterPanel />}
        {currentStep === 1 && <HardwareFilterPanel />}
      </div>
    </div>
  );
}
