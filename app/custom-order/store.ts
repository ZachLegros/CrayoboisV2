import { Hardware, Material } from "@prisma/client";
import { create } from "zustand";

export type PriceFilterValue = "asc" | "desc";

const getInitialPriceFilter = (): PriceFilterValue => "asc";
const getInitialTypeFilter = () => "all";
const getInitialOriginFilter = () => "all";

export type Filter = {
  value: string;
  setValue: (value: string) => void;
  clear: () => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

const createFilter = (
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
  selectedMaterialId: string | null;
  selectMaterial: (materialId: string | null) => void;
  selectedHardwareId: string | null;
  selectHardware: (hardwareId: string | null) => void;
  typeFilter: Filter;
  priceFilter: Filter;
  originFilter: Filter;
  clearFilters: () => void;
};

export const useCustomOrderStore = create<CustomOrderStore>((set) => ({
  currentStep: 0,
  setCurrentStep: (step: number) => set({ currentStep: step }),
  materials: [],
  setMaterials: (materials: Material[]) => set({ materials }),
  hardwares: [],
  setHardwares: (hardwares: Hardware[]) => set({ hardwares }),
  selectedMaterialId: null,
  selectMaterial: (materialId: string | null) => set({ selectedMaterialId: materialId }),
  selectedHardwareId: null,
  selectHardware: (hardwareId: string | null) => set({ selectedHardwareId: hardwareId }),
  typeFilter: createFilter(set, "typeFilter", true, getInitialTypeFilter),
  originFilter: createFilter(set, "originFilter", false, getInitialOriginFilter),
  priceFilter: createFilter(set, "priceFilter", false, getInitialPriceFilter),
  clearFilters: () => {
    set((state) => ({
      typeFilter: { ...state.typeFilter, value: getInitialTypeFilter() },
      originFilter: { ...state.originFilter, value: getInitialOriginFilter() },
      priceFilter: { ...state.priceFilter, value: getInitialPriceFilter() },
    }));
  },
}));
