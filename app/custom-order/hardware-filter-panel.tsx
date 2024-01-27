"use client";

import HardwareFilters from "./hardware-filters";
import { ResetButton } from "./material-filter-panel";
import { useCustomOrderStore } from "./store";

export default function HardwareFilterPanel(props: { isDisabled?: boolean }) {
  const { isDisabled } = props;
  const { typeFilter, priceFilter } = useCustomOrderStore();

  const handleReset = () => {
    typeFilter.setEnabled(true);
    priceFilter.setEnabled(false);
  };

  return (
    <div
      className="flex flex-col w-full h-full overflow-y-auto gap-4 aria-disabled:pointer-events-none aria-disabled:opacity-50"
      aria-disabled={isDisabled}
    >
      <div className="flex w-full justify-between items-center pl-2">
        <p className="text-xl font-bold">Filtrer</p>
        <ResetButton
          className={`${
            typeFilter.enabled || priceFilter.enabled ? "visible" : "invisible"
          }`}
          onClick={handleReset}
        />
      </div>
      <HardwareFilters />
    </div>
  );
}
