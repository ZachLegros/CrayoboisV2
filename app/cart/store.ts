"use client";

import { CustomProduct, Product } from "@prisma/client";
import { create } from "zustand";

export type CartStore = {
  cart: (Product | CustomProduct)[];
  addToCart: (product: Product | CustomProduct) => void;
  removeFromCart: (product: Product | CustomProduct) => void;
  clearCart: () => void;
};

const getInitialCart = (): (Product | CustomProduct)[] => {
  if (typeof localStorage === "undefined") return [];
  const cart = localStorage.getItem("cart");
  if (cart) {
    return JSON.parse(cart);
  }
  return [];
};

export const useCartStore = create<CartStore>((set, state) => ({
  cart: getInitialCart(),
  addToCart: (product) => {
    const newCart = [...state().cart, product];
    set(() => ({ cart: newCart }));
    localStorage.setItem("cart", JSON.stringify(newCart));
  },
  removeFromCart: (product) => {
    const newCart = state().cart.filter((item) => item.id !== product.id);
    set(() => ({ cart: newCart }));
    localStorage.setItem("cart", JSON.stringify(newCart));
  },
  clearCart: () => {
    set(() => ({ cart: [] }));
    localStorage.setItem("cart", "[]");
  },
}));
