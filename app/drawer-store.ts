import { create } from "zustand";

type DrawerStore = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const useDrawerStore = create<DrawerStore>((set) => ({
  isOpen: false,
  onOpenChange: (isOpen: boolean) => set({ isOpen }),
}));

export default useDrawerStore;
