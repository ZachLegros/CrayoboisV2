import type { ClientOrder } from "@prisma/client";
import { create } from "zustand";

export type UserOrdersStore = {
  orders: { [key: string]: ClientOrder } | null;
  setOrders: (orders: ClientOrder[]) => { [key: string]: ClientOrder };
  countOrders: () => number;
};

export const useUserOrdersStore = create<UserOrdersStore>((set, get) => ({
  orders: null,
  setOrders: (orders: ClientOrder[]) => {
    const sortedOrders = orders.sort((a, b) => b.order_no - a.order_no);
    const ordersObj: { [orderId: string]: ClientOrder } = {};
    for (const order of sortedOrders) {
      ordersObj[order.id] = order;
    }
    set({ orders: ordersObj });
    return ordersObj;
  },
  countOrders: () => {
    const orders = get().orders;
    if (!orders) return 0;
    return Object.keys(orders).length;
  },
}));

export default useUserOrdersStore;
