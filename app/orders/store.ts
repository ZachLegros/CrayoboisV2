import type { ClientOrder } from "@prisma/client";
import { create } from "zustand";

export type UserOrdersStore = {
  orders: { [key: string]: ClientOrder };
  setOrders: (orders: ClientOrder[]) => { [key: string]: ClientOrder };
  countOrders: () => number;
};

export const useUserOrdersStore = create<UserOrdersStore>((set, get) => ({
  orders: {},
  setOrders: (orders: ClientOrder[]) => {
    const ordersObj: { [orderId: string]: ClientOrder } = {};
    for (const order of orders) {
      ordersObj[order.id] = order;
    }
    set({ orders: ordersObj });
    return ordersObj;
  },
  countOrders: () => Object.keys(get().orders).length,
}));

export default useUserOrdersStore;
