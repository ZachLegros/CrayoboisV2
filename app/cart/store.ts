import { Shipping } from "@prisma/client";
import { create } from "zustand";
import { fetchShippingMethods, syncCart as syncCartAction } from "./actions";
import { DbProduct, getHardwareId, getMaterialId } from "@/utils/productUtils";
import {
  getCartTotalQuantity,
  getShippingPrice,
  getTotal,
  getTotalPrice,
  getTotalTPS,
  getTotalTVQ,
  isShippingFree,
} from "./utils";

export type CartProduct = { id: string };
export type CartCustomProduct = CartProduct & {
  material_id: string;
  hardware_id: string;
};
export type CartProductType = CartProduct | CartCustomProduct;
export type CartItemData = {
  [key: string]: DbProduct | undefined;
};
export type Cart = CartItemType<CartProductType>[];

export type PriceBreakdown = {
  subtotal: number;
  tps: number;
  tvq: number;
  shipping: number;
  total: number;
};

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

const storeCartInLocalStorage = (cart: Cart) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cart));
};

const storeCartItemDataInLocalStorage = (cartItemData: CartItemData) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("cartItemData", JSON.stringify(cartItemData));
};

const initializeCartFromLocalStorage = (callback?: (cart: Cart) => void): Cart => {
  if (typeof localStorage === "undefined") return [];
  const cartString = localStorage.getItem("cart");
  const cart = cartString ? JSON.parse(cartString) : [];
  callback?.(cart);
  return cart;
};

const initializeCartItemDataFromLocalStorage = (
  callback?: (cartItemData: CartItemData) => void
): CartItemData => {
  if (typeof localStorage === "undefined") return {};
  const cartItemDataString = localStorage.getItem("cartItemData");
  const cartItemData = cartItemDataString ? JSON.parse(cartItemDataString) : {};
  callback?.(cartItemData);
  return cartItemData;
};

const isProductInCart = (product: CartProductType, cart: Cart) => {
  return cart.some((item) => item.product.id === product.id);
};

const syncCart = async (cart: Cart, state: () => CartStore) => {
  const lastSync = localStorage.getItem("lastSync");
  if (lastSync && Date.now() - parseInt(lastSync) < 1000 * 60 * 60) return;
  const syncedCart = await syncCartAction(cart);
  const newCart: Cart = syncedCart.map(({ product, quantity }) => ({
    product: {
      id: product.id,
      material_id: getMaterialId(product),
      hardware_id: getHardwareId(product),
    },
    quantity,
  }));
  const newCartItemData: CartItemData = syncedCart.reduce((acc, { product }) => {
    acc[product.id as keyof CartItemData] = product;
    return acc;
  }, {} as CartItemData);
  state().setCart(newCart);
  state().setCartItemData(newCartItemData);
  localStorage.setItem("lastSync", Date.now().toString());
};

const fetchShipping = async (
  state: () => CartStore,
  set: (arg0: { [key: string]: any }) => void
) => {
  const shippingMethods = await fetchShippingMethods();
  inferShippingMethod(state, set);
  set({ shippingMethods: shippingMethods.sort((a, b) => a.price - b.price) });
};

const inferShippingMethod = (
  state: () => CartStore,
  set: {
    (arg0: { shippingMethod: { id: string; name: string; price: number } }): void;
  }
) => {
  const { cart, cartItemData } = state();
  const freeMethod = state().shippingMethods.filter(
    (method) => method.price === 0
  )[0];
  const nonFreeMethods = state().shippingMethods.filter(
    (method) => method.price !== 0
  );
  if (
    isShippingFree(getCartTotalQuantity(cart), getTotalPrice(cart, cartItemData))
  ) {
    set({ shippingMethod: freeMethod });
  } else if (state().shippingMethod?.price === 0) {
    // reset to non-free method
    set({ shippingMethod: nonFreeMethods[0] });
  } else {
    set({ shippingMethod: nonFreeMethods[0] });
  }
};

const getBreakdown = (state: () => CartStore) => {
  const { cart, cartItemData, shippingMethod } = state();
  return {
    subtotal: getTotalPrice(cart, cartItemData),
    tps: getTotalTPS(cart, cartItemData),
    tvq: getTotalTVQ(cart, cartItemData),
    shipping: getShippingPrice(shippingMethod!),
    total: getTotal(cart, cartItemData, shippingMethod!),
  };
};

export type CartStore = {
  cart: Cart;
  setCart: (cart: Cart) => void;
  cartItemData: CartItemData;
  setCartItemData: (cartItemData: CartItemData) => void;
  getItemData: (product: CartProductType) => DbProduct | undefined;
  addToCart: (product: DbProduct) => void;
  removeFromCart: (product: CartProductType) => void;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  setItemQuantity: (product: CartProductType, quantity: number) => void;
  shippingMethods: readonly Shipping[];
  shippingMethod: Shipping | null;
  setShippingMethod: (id: string) => void;
  fetchShipping: () => Promise<void>;
  inferShippingMethod: () => void;
  isProductInCart: (product: CartProductType) => boolean;
  getBreakdown: () => PriceBreakdown;
};

export const useCartStore = create<CartStore>((set, state) => ({
  syncCart: () => syncCart(state().cart, state),
  cart: initializeCartFromLocalStorage((cart) => syncCart(cart, state)),
  setCart: (cart: Cart) => {
    set(() => ({ cart }));
    storeCartInLocalStorage(cart);
    inferShippingMethod(state, set);
  },
  cartItemData: initializeCartItemDataFromLocalStorage(),
  setCartItemData: (cartItemData: CartItemData) => {
    set(() => ({ cartItemData }));
    storeCartItemDataInLocalStorage(cartItemData);
  },
  getItemData: (product) => state().cartItemData[product.id],
  addToCart: (product) => {
    const alreadyInCart = state().cart.some(
      (item) => item.product.id === product.id
    );
    if (alreadyInCart) return;
    const newCart = [
      ...state().cart,
      {
        product: {
          id: product.id,
          material_id: getMaterialId(product),
          hardware_id: getHardwareId(product),
        },
        quantity: 1,
      },
    ];
    const newCartItemData = { ...state().cartItemData, [product.id]: product };
    state().setCart(newCart);
    state().setCartItemData(newCartItemData);
  },
  removeFromCart: (product) => {
    const newCart = state().cart.filter((item) => item.product.id !== product.id);
    const newCartItemData = { ...state().cartItemData, [product.id]: undefined };
    state().setCart(newCart);
    state().setCartItemData(newCartItemData);
  },
  setItemQuantity: (product, quantity) => {
    const newCart = [...state().cart].map((item) =>
      item.product.id === product.id ? { ...item, quantity } : item
    );
    state().setCart(newCart);
  },
  isProductInCart: (product) => isProductInCart(product, state().cart),
  clearCart: () => {
    state().setCart([]);
    state().setCartItemData({});
  },
  shippingMethods: [],
  shippingMethod: null,
  setShippingMethod: (id) => {
    set(() => ({
      shippingMethod: state().shippingMethods.find((item) => item.id === id),
    }));
  },
  fetchShipping: () => fetchShipping(state, set),
  inferShippingMethod: () => inferShippingMethod(state, set),
  getBreakdown: () => getBreakdown(state),
}));
