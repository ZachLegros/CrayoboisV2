import { Shipping } from "@prisma/client";
import { create } from "zustand";
import { syncCart } from "./actions";

export type CartProduct = { id: string };
export type CartCustomProduct = CartProduct & { material_id: string; hardware_id: string };
export type CartProductType = CartProduct | CartCustomProduct;

export const isCartCustomProduct = (
  cartProduct: CartProductType
): cartProduct is CartCustomProduct => {
  return (
    (cartProduct as CartCustomProduct).material_id !== undefined &&
    (cartProduct as CartCustomProduct).hardware_id !== undefined
  );
};

export const getCartProductMaterialId = (product: CartProductType) => {
  return isCartCustomProduct(product) ? product.material_id : undefined;
};

export const getCartProductHardwareId = (product: CartProductType) => {
  return isCartCustomProduct(product) ? product.hardware_id : undefined;
};

export type CartItemType<T> = {
  product: T;
  quantity: number;
};

export const isCartItemType = (
  item: CartItemType<CartProductType>
): item is CartItemType<CartProductType> => {
  return item.product !== undefined && !isNaN(item.quantity);
};

const storeCartInLocalStorage = (cart: CartItemType<CartProductType>[]) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cart));
};

const initializeCartFromLocalStorage = (
  callback?: (cart: CartItemType<CartProductType>[]) => void
) => {
  if (typeof localStorage === "undefined") return [];
  const cartString = localStorage.getItem("cart");
  const cart = cartString ? JSON.parse(cartString) : [];
  callback?.(cart);
  return cart;
};

const isProductInCart = (
  product: CartProductType,
  cart: readonly CartItemType<CartProductType>[]
) => {
  return cart.some((item) => item.product.id === product.id);
};

export type CartStore = {
  cart: readonly CartItemType<CartProductType>[];
  addToCart: (product: CartProductType) => void;
  removeFromCart: (product: CartProductType) => void;
  clearCart: () => void;
  setItemQuantity: (product: CartProductType, quantity: number) => void;
  shippingMethods: readonly Shipping[];
  setShippingMethods: (shippingMethods: Shipping[]) => void;
  shippingMethod: Shipping | null;
  setShippingMethod: (id: string) => void;
  isProductInCart: (product: CartProductType) => boolean;
};

export const useCartStore = create<CartStore>((set, state) => ({
  cart: initializeCartFromLocalStorage(async (cart) => {
    const syncedCart = await syncCart(cart);
    storeCartInLocalStorage(syncedCart);
    set(() => ({ cart: syncedCart }));
  }),
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
  isProductInCart: (product) => isProductInCart(product, state().cart),
  clearCart: () => {
    set(() => ({ cart: [] }));
    storeCartInLocalStorage([]);
  },
  shippingMethods: [],
  setShippingMethods: (shippingMethods) => set(() => ({ shippingMethods })),
  shippingMethod: null,
  setShippingMethod: (id: string) =>
    set(() => ({ shippingMethod: state().shippingMethods.find((item) => item.id === id) })),
}));
