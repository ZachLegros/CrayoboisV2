import { create } from "zustand";

type FloatingBarStore = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const useFloatingBarStore = create<FloatingBarStore>((set) => ({
  isOpen: false,
  onOpenChange: (isOpen: boolean) => set({ isOpen }),
}));

export default useFloatingBarStore;
