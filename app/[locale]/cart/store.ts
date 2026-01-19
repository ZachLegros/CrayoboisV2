import { create } from "zustand";

import { Cart } from "./cart-view";
import type { CartState } from "./types";

export type CartStore = {
  cart: Cart;
  cartState: CartState;
};

export const useCartStore = create<CartStore>((set) => {
  const cart = new Cart((state) => set({ cartState: { ...state } }));
  return {
    cart,
    cartState: cart.getState(),
  };
});
