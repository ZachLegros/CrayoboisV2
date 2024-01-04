import { Product, Shipping } from "@prisma/client";
import { create } from "zustand";
import { NonNullabbleProduct, ProductWithComponents } from "@/utils/customProductFactory";
import { fetchProducts } from "./actions";

export type CartItemType = {
  product: Product | ProductWithComponents;
  quantity: number;
};

export const getProductMaxQuantity = (product: Product | ProductWithComponents) => {
  if (product.is_custom) {
    return Math.min(
      (product as ProductWithComponents).material.quantity,
      (product as ProductWithComponents).hardware.quantity
    );
  }
  return product.quantity;
};

const storeCartInLocalStorage = (cart: CartItemType[]) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cart));
};

const initializeCartFromLocalStorage = (callback?: (cart: CartItemType[]) => void) => {
  if (typeof localStorage === "undefined") return [];
  const cartString = localStorage.getItem("cart");
  const cart = cartString ? JSON.parse(cartString) : [];
  callback?.(cart);
  return cart;
};

async function syncProducts(cart: CartItemType[], setCart: (cart: CartItemType[]) => void) {
  const normalProductTemplates = cart
    .filter((item) => !item.product.is_custom)
    .map((item) => item.product);
  const customProductTemplates = cart
    .filter((item) => item.product.is_custom)
    .map((item) => item.product as NonNullabbleProduct);
  const products = await fetchProducts(normalProductTemplates, customProductTemplates);
  const inSyncCartItemTypes: CartItemType[] = cart
    .filter((item) => {
      if (item.product.is_custom) {
        return products.some(
          (product) =>
            item.product.material_id === product.material_id &&
            item.product.hardware_id === product.hardware_id
        );
      } else {
        return products.some((product) => product.id === item.product.id);
      }
    })
    .map((item) => {
      const product = item.product.is_custom
        ? products.find(
            (product) =>
              item.product.material_id === product.material_id &&
              item.product.hardware_id === product.hardware_id
          )
        : products.find((product) => product.id === item.product.id);
      if (product) {
        const closestMaxQuantity = Math.min(item.quantity, getProductMaxQuantity(product));
        return {
          product: product,
          quantity: closestMaxQuantity > 0 ? closestMaxQuantity : 1,
        };
      }
    })
    .filter((item): item is CartItemType => !!item);
  storeCartInLocalStorage(inSyncCartItemTypes);
  setCart(inSyncCartItemTypes);
}

export type CartStore = {
  cart: readonly CartItemType[];
  addToCart: (product: Product | ProductWithComponents) => void;
  removeFromCart: (product: Product | ProductWithComponents) => void;
  clearCart: () => void;
  setItemQuantity: (product: Product | ProductWithComponents, quantity: number) => void;
  shippingMethods: readonly Shipping[];
  setShippingMethods: (shippingMethods: Shipping[]) => void;
  shippingMethod: Shipping | null;
  setShippingMethod: (id: number) => void;
};

export const useCartStore = create<CartStore>((set, state) => ({
  cart: initializeCartFromLocalStorage((cart) =>
    syncProducts(cart, (cart) => set(() => ({ cart })))
  ),
  addToCart: (product) => {
    const alreadyInCart = state().cart.find((item) => item.product.id === product.id);
    if (alreadyInCart) return;
    const newCart = [...state().cart, { product, quantity: 1 }];
    set(() => ({ cart: newCart }));
    storeCartInLocalStorage(newCart);
  },
  removeFromCart: (product) => {
    const newCart = state().cart.filter((item) => item.product.id !== product.id);
    set(() => ({ cart: newCart }));
    storeCartInLocalStorage(newCart);
  },
  setItemQuantity: (product, quantity) => {
    const newCart = state().cart.map((item) =>
      item.product.id === product.id ? { ...item, quantity } : item
    );
    set(() => ({ cart: newCart }));
    storeCartInLocalStorage(newCart);
  },
  clearCart: () => {
    set(() => ({ cart: [] }));
    storeCartInLocalStorage([]);
  },
  shippingMethods: [],
  setShippingMethods: (shippingMethods) => set(() => ({ shippingMethods })),
  shippingMethod: null,
  setShippingMethod: (id: number) =>
    set(() => ({ shippingMethod: state().shippingMethods.find((item) => item.id === id) })),
}));
