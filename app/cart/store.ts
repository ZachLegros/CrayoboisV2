import { Product } from "@prisma/client";
import { create } from "zustand";
import { NonNullabbleProduct, ProductWithComponents } from "@/utils/customProductFactory";
import { fetchProducts } from "./actions";

const storeCartInLocalStorage = (cart: Product[]) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cart));
};

const initializeCartFromLocalStorage = (callback: (cart: Product[]) => void) => {
  if (typeof localStorage === "undefined") return [];
  const cartString = localStorage.getItem("cart");
  const cart = cartString ? JSON.parse(cartString) : [];
  callback(cart);
  return cart;
};

async function syncProducts(cart: readonly Product[], setCart: (cart: Product[]) => void) {
  const normalProductTemplates = cart.filter((item) => !item.is_custom);
  const customProductTemplates = cart.filter((item): item is NonNullabbleProduct => item.is_custom);
  const products = await fetchProducts(normalProductTemplates, customProductTemplates);
  storeCartInLocalStorage(products);
  setCart(products);
}

export type CartStore = {
  cart: readonly Product[];
  addToCart: (product: Product | ProductWithComponents) => void;
  removeFromCart: (product: Product | ProductWithComponents) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set, state) => ({
  cart: initializeCartFromLocalStorage((cart) =>
    syncProducts(cart, (cart) => set(() => ({ cart })))
  ),
  addToCart: (product) => {
    const alreadyInCart = state().cart.find((item) => item.id === product.id);
    if (alreadyInCart) return;
    const newCart = [...state().cart, product];
    set(() => ({ cart: newCart }));
    storeCartInLocalStorage(newCart);
  },
  removeFromCart: (product) => {
    const newCart = state().cart.filter((item) => item.id !== product.id);
    set(() => ({ cart: newCart }));
    storeCartInLocalStorage(newCart);
  },
  clearCart: () => {
    set(() => ({ cart: [] }));
    storeCartInLocalStorage([]);
  },
}));
