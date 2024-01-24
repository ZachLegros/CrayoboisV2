import { create } from "zustand";
import { ClientOrder, OrderStatus } from "@prisma/client";

type AdminStore = {
  orders: ClientOrder[];
  setOrders: (orders: ClientOrder[]) => void;
  updateOrderStatus: (orderId: string, orderStatus: OrderStatus) => void;
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
}));

export default useAdminStore;
