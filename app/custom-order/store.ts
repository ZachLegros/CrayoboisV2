import type { Hardware, Material } from "@prisma/client";
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

type SetFn = (store: Partial<CustomOrderStore>) => void;
type GetFn = () => CustomOrderStore;

export const createFilter = (params: {
  set: SetFn;
  get: GetFn;
  filterKey: string;
  enabled: boolean;
  initialValue: string;
}): Filter => {
  const { set, get, filterKey, enabled, initialValue } = params;
  return {
    value: initialValue,
    enabled,
    setValue: (value: string) => {
      const filter = get()[filterKey as keyof CustomOrderStore] as Filter;
      set({ [filterKey]: { ...filter, value } });
    },
    setEnabled: (enabled: boolean) => {
      const filter = get()[filterKey as keyof CustomOrderStore] as Filter;
      set({ [filterKey]: { ...filter, enabled, value: initialValue } });
    },
    clear: () => {
      const filter = get()[filterKey as keyof CustomOrderStore] as Filter;
      set({ [filterKey]: { ...filter, value: initialValue } });
    },
  };
};

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

export const useCustomOrderStore = create<CustomOrderStore>((set, get) => ({
  currentStep: 0,
  setCurrentStep: (step: number) => {
    get().clearFilters();
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

  typeFilter: createFilter({
    set,
    get,
    filterKey: "typeFilter",
    enabled: true,
    initialValue: getInitialTypeFilter(),
  }),
  originFilter: createFilter({
    set,
    get,
    filterKey: "originFilter",
    enabled: false,
    initialValue: getInitialOriginFilter(),
  }),
  priceFilter: createFilter({
    set,
    get,
    filterKey: "priceFilter",
    enabled: false,
    initialValue: getInitialPriceFilter(),
  }),

  clearFilters: () => {
    get().typeFilter.clear();
    get().originFilter.clear();
    get().priceFilter.clear();
  },
  clearSelections: () => {
    get().selectMaterial(null);
    get().selectHardware(null);
  },
  reset: () => {
    set(() => ({ currentStep: 0 }));
    get().clearFilters();
    get().clearSelections();
  },
}));
