import { create } from "zustand";

import { Cart } from "./cart-view";

export type CartStore = {
  cart: Cart;
};

export const useCartStore = create<CartStore>(() => ({
  cart: new Cart(),
}));
