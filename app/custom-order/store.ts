import { Hardware, Material } from "@prisma/client";
import { create } from "zustand";

export type PriceFilter = "asc" | "desc" | null;

export type CustomOrderStore = {
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  hardwares: Hardware[];
  setHardwares: (hardwares: Hardware[]) => void;
  selectedMaterialId: string | null;
  selectMaterial: (materialId: string) => void;
  selectedHardwareId: string | null;
  selectHardware: (hardwareId: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  priceFilter: PriceFilter;
  setPriceFilter: (price: PriceFilter) => void;
  originFilter: string;
  setOriginFilter: (origin: string) => void;
  clearFilters: () => void;
  clearTypeFilter: () => void;
  clearPriceFilter: () => void;
  clearOriginFilter: () => void;
};

export const useCustomOrderStore = create<CustomOrderStore>((set) => ({
  materials: [],
  setMaterials: (materials: Material[]) => set({ materials }),
  hardwares: [],
  setHardwares: (hardwares: Hardware[]) => set({ hardwares }),
  selectedMaterialId: null,
  selectMaterial: (materialId: string) => set({ selectedMaterialId: materialId }),
  selectedHardwareId: null,
  selectHardware: (hardwareId: string) => set({ selectedHardwareId: hardwareId }),
  typeFilter: "all",
  setTypeFilter: (type: string) => set({ typeFilter: type }),
  priceFilter: null,
  setPriceFilter: (price: PriceFilter) => set({ priceFilter: price }),
  originFilter: "all",
  setOriginFilter: (origin: string) => set({ originFilter: origin }),
  clearTypeFilter: () => set({ typeFilter: "all" }),
  clearPriceFilter: () => set({ priceFilter: null }),
  clearOriginFilter: () => set({ originFilter: "all" }),
  clearFilters: () => set({ typeFilter: "all", priceFilter: null, originFilter: "all" }),
}));
