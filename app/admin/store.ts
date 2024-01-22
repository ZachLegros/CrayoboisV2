import { create } from "zustand";
import { ClientOrder } from "@prisma/client";

type AdminStore = {
  orders: ClientOrder[];
  setOrders: (orders: ClientOrder[]) => void;
};

export const useAdminStore = create<AdminStore>((set) => ({
  orders: [],
  setOrders: (orders: ClientOrder[]) => set({ orders }),
}));

export default useAdminStore;
