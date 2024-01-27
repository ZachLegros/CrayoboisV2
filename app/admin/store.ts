"use client";

import { create } from "zustand";
import { ClientOrder, Material, OrderStatus } from "@prisma/client";
import { updateMaterialInDb } from "./materials/actions";
import { updateOrderStatusInDb } from "./orders/actions";

type AdminStore = {
  orders: { [key: string]: ClientOrder };
  setOrders: (orders: ClientOrder[]) => void;
  updateOrderStatus: (
    orderId: string,
    orderStatus: OrderStatus
  ) => Promise<boolean>;
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
  orders: {},
  setOrders: (orders: ClientOrder[]) => {
    const ordersObj = orders.reduce((acc, order) => {
      return { ...acc, [order.id]: order };
    }, {});
    set({ orders: ordersObj });
  },
  updateOrderStatus: async (orderId: string, orderStatus: OrderStatus) => {
    const originalOrders = { ...get().orders };
    const updatedOrder = { ...get().orders[orderId], status: orderStatus };
    const newOrders = { ...get().orders, [orderId]: updatedOrder };
    set({ orders: newOrders });
    return updateOrderStatusInDb(orderId, orderStatus).then((success) => {
      if (!success) {
        set({ orders: originalOrders });
      }
      return success;
    });
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
