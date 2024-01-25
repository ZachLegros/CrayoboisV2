import { create } from "zustand";
import { ClientOrder, Material, OrderStatus } from "@prisma/client";

type AdminStore = {
  orders: ClientOrder[];
  setOrders: (orders: ClientOrder[]) => void;
  updateOrderStatus: (orderId: string, orderStatus: OrderStatus) => void;
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  updateMaterial: (material: Material) => void;
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

  materials: [],
  setMaterials: (materials: Material[]) => set({ materials }),
  updateMaterial: (material: Material) => {
    const materialIndex = get().materials.findIndex(
      (m) => m.id === material.id
    );
    if (materialIndex !== -1) {
      const materials = [...get().materials];
      materials[materialIndex] = material;
      set({ materials });
    }
  },
}));

export default useAdminStore;
