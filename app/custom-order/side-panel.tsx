"use client";

import HardwareFilterPanel from "./hardware-filter-panel";
import MaterialFilterPanel from "./material-filter-panel";
import { useCustomOrderStore } from "./store";

export default function SidePanel() {
  const { currentStep } = useCustomOrderStore();

  return (
    <div className="w-64 h-max overflow-hidden sticky top-0 -mt-[calc(4rem+1.5rem+1px)] pt-[calc(4rem+1.5rem+1px)]">
      <div className="h-[calc(100vh-4rem-1.5rem-1px)] overflow-y-auto pr-3">
        {currentStep === 0 && <MaterialFilterPanel />}
        {(currentStep === 1 || currentStep === 2) && (
          <HardwareFilterPanel isDisabled={currentStep === 2} />
        )}
      </div>
    </div>
  );
}
