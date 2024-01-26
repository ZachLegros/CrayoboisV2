"use client";

import { create } from "zustand";
import { ClientOrder, Material, OrderStatus } from "@prisma/client";
import { updateMaterialInDb } from "./materials/actions";

type AdminStore = {
  orders: ClientOrder[];
  setOrders: (orders: ClientOrder[]) => void;
  updateOrderStatus: (orderId: string, orderStatus: OrderStatus) => void;
  materials: { [key: string]: Material };
  setMaterial: (material: Material) => void;
  setMaterials: (materials: Material[]) => void;
  updateMaterial: <P extends keyof Material>(
    material: Material,
    property: P,
    value: Material[P]
  ) => Promise<boolean>;
};

export const useAdminStore = create<AdminStore>((set, get) => ({
  orders: [],
  setOrders: (orders: ClientOrder[]) => set({ orders }),
  updateOrderStatus: (orderId: string, orderStatus: OrderStatus) => {
    const orderIndex = get().orders.findIndex((order) => order.id === orderId);
    if (orderIndex !== -1) {
      const orders = [...get().orders];
      orders[orderIndex] = { ...orders[orderIndex], status: orderStatus };
      set({ orders });
    }
  },

  materials: {},
  setMaterial: (material: Material) => {
    set({ materials: { ...get().materials, [material.id]: material } });
  },
  setMaterials: (materials: Material[]) => {
    const materialsObj = materials.reduce((acc, material) => {
      return { ...acc, [material.id]: material };
    }, {});
    set({ materials: materialsObj });
  },
  updateMaterial: async <P extends keyof Material>(
    material: Material,
    property: P,
    value: Material[P]
  ) => {
    const originalMaterials = { ...get().materials };
    const updatedMaterial = { ...material, [property]: value };
    const newMaterials = { ...get().materials, [material.id]: updatedMaterial };
    set({ materials: newMaterials });
    return updateMaterialInDb(updatedMaterial).then((success) => {
      if (!success) {
        set({ materials: originalMaterials });
      }
      return success;
    });
  },
}));

export default useAdminStore;
