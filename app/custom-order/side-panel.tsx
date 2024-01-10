"use client";

import HardwareFilterPanel from "./hardware-filter-panel";
import MaterialFilterPanel from "./material-filter-panel";
import { useCustomOrderStore } from "./store";

export default function SidePanel() {
  const { currentStep } = useCustomOrderStore();

  return (
    <div className="w-64 h-screen overflow-hidden sticky top-0 -mt-[calc(64px+24px+1px)] pt-[calc(64px+24px+1px)]">
      <div className="h-full overflow-y-auto overflow-x-hidden pr-2">
        {currentStep === 0 && <MaterialFilterPanel />}
        {(currentStep === 1 || currentStep === 2) && (
          <HardwareFilterPanel isDisabled={currentStep === 2} />
        )}
      </div>
    </div>
  );
}
