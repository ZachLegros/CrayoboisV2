import { Hardware, Material } from "@prisma/client";
import { create } from "zustand";

export type PriceFilterValue = "asc" | "desc";

const getInitialPriceFilter = (): PriceFilterValue => "desc";
const getInitialTypeFilter = () => "all";
const getInitialOriginFilter = () => "all";

export type Filter = {
  value: string;
  setValue: (value: string) => void;
  clear: () => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

export const createFilter = (
  set: (arg0: {
    (state: any): { [x: string]: any };
    (state: any): { [x: string]: any };
    (state: any): { [x: string]: any };
  }) => void,
  filterKey: string,
  enabled: boolean,
  valueInitializer: () => any
): Filter => ({
  value: valueInitializer(),
  enabled,
  setValue: (value: string) => set((state) => ({ [filterKey]: { ...state[filterKey], value } })),
  setEnabled: (enabled: boolean) =>
    set((state) => ({
      [filterKey]: { ...state[filterKey], enabled, value: valueInitializer() },
    })),
  clear: () =>
    set((state) => ({
      [filterKey]: { ...state[filterKey], value: valueInitializer() },
    })),
});

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
  typeFilter: Filter;
  priceFilter: Filter;
  originFilter: Filter;
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
  typeFilter: createFilter(set, "typeFilter", true, getInitialTypeFilter),
  originFilter: createFilter(set, "originFilter", false, getInitialOriginFilter),
  priceFilter: createFilter(set, "priceFilter", false, getInitialPriceFilter),
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
