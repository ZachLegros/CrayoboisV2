import type { Hardware, Material } from "@prisma/client";
import { create } from "zustand";

export type PriceFilterValue = "asc" | "desc";

const getInitialPriceFilter = (): PriceFilterValue => "desc";
const getInitialTypeFilter = () => "all";
const getInitialOriginFilter = () => "all";

export interface FilterType<T> {
  value: T;
  setValue: (value: T) => void;
  clear: () => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}
export class Filter<T> implements FilterType<T> {
  value: T;
  initialValue: T;
  enabled: boolean;

  constructor(params: {
    value: T;
    enabled: boolean;
  }) {
    const { value, enabled } = params;
    this.value = value;
    this.enabled = enabled;
    this.initialValue = value;
  }

  setValue(value: T) {
    this.value = value;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.clear();
  }

  clear() {
    this.value = this.initialValue;
  }
}

export type CustomOrderStore = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  hardwares: Hardware[];
  setHardwares: (hardwares: Hardware[]) => void;
  selectedMaterial: Material | null;
  selectMaterial: (material: Material | null) => void;
  selectedHardware: Hardware | null;
  selectHardware: (hardware: Hardware | null) => void;
  typeFilter: Filter<string>;
  priceFilter: Filter<PriceFilterValue>;
  originFilter: Filter<string>;
  clearFilters: () => void;
  clearSelections: () => void;
  reset: () => void;
};

export const useCustomOrderStore = create<CustomOrderStore>((set, state) => ({
  currentStep: 0,
  setCurrentStep: (step: number) => {
    state().clearFilters();
    set({ currentStep: step });
  },
  materials: [],
  setMaterials: (materials: Material[]) => set({ materials }),
  hardwares: [],
  setHardwares: (hardwares: Hardware[]) => set({ hardwares }),
  selectedMaterial: null,
  selectMaterial: (material: Material | null) => set({ selectedMaterial: material }),
  selectedHardware: null,
  selectHardware: (hardware: Hardware | null) => set({ selectedHardware: hardware }),
  typeFilter: new Filter({ value: getInitialTypeFilter(), enabled: true }),
  originFilter: new Filter({ value: getInitialOriginFilter(), enabled: false }),
  priceFilter: new Filter({ value: getInitialPriceFilter(), enabled: false }),
  clearFilters: () => {
    state().typeFilter.clear();
    state().originFilter.clear();
    state().priceFilter.clear();
  },
  clearSelections: () => {
    state().selectMaterial(null);
    state().selectHardware(null);
  },
  reset: () => {
    set(() => ({ currentStep: 0 }));
    state().clearFilters();
    state().clearSelections();
  },
}));
