import { Shipping } from "@prisma/client";
import { create } from "zustand";
import { syncCart as syncCartAction } from "./actions";
import { DbProduct, getHardwareId, getMaterialId } from "@/utils/productUtils";

export type CartProduct = { id: string };
export type CartCustomProduct = CartProduct & { material_id: string; hardware_id: string };
export type CartProductType = CartProduct | CartCustomProduct;
export type CartItemData = {
  [key: string]: DbProduct | undefined;
};
export type Cart = CartItemType<CartProductType>[];

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
  const cartItemDataString = localStorage.getItem("cart");
  const cartItemData = cartItemDataString ? JSON.parse(cartItemDataString) : {};
  callback?.(cartItemData);
  return cartItemData;
};

const isProductInCart = (product: CartProductType, cart: Cart) => {
  return cart.some((item) => item.product.id === product.id);
};

const syncCart = async (
  cart: Cart,
  set: (arg0: () => { cart: Cart; cartItemData: CartItemData }) => void
) => {
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
  storeCartInLocalStorage(newCart);
  storeCartItemDataInLocalStorage(newCartItemData);
  set(() => ({ cart: newCart, cartItemData: newCartItemData }));
};

export type CartStore = {
  cart: Cart;
  cartItemData: CartItemData;
  getItemData: (product: CartProductType) => DbProduct | undefined;
  addToCart: (product: DbProduct) => void;
  removeFromCart: (product: CartProductType) => void;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  setItemQuantity: (product: CartProductType, quantity: number) => void;
  shippingMethods: readonly Shipping[];
  setShippingMethods: (shippingMethods: Shipping[]) => void;
  shippingMethod: Shipping | null;
  setShippingMethod: (id: string) => void;
  isProductInCart: (product: CartProductType) => boolean;
  getTotalPrice: () => number;
  getTotalTPS: () => number;
  getTotalTVQ: () => number;
  getCartTotal: () => number;
  getCartTotalQuantity: () => number;
  isShippingFree: () => boolean;
  getShippingPrice: () => number;
  getTotal: () => number;
};

export const useCartStore = create<CartStore>((set, state) => ({
  syncCart: () => syncCart(state().cart, set),
  cart: initializeCartFromLocalStorage((cart) => syncCart(cart, set)),
  cartItemData: initializeCartItemDataFromLocalStorage(),
  getItemData: (product) => state().cartItemData[product.id],
  addToCart: (product) => {
    const alreadyInCart = state().cart.some((item) => item.product.id === product.id);
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
    storeCartInLocalStorage(newCart);
    storeCartItemDataInLocalStorage(newCartItemData);
    set(() => ({ cart: newCart, cartItemData: newCartItemData }));
  },
  removeFromCart: (product) => {
    const newCart = state().cart.filter((item) => item.product.id !== product.id);
    const newCartItemData = { ...state().cartItemData, [product.id]: undefined };
    storeCartInLocalStorage(newCart);
    storeCartItemDataInLocalStorage(newCartItemData);
    set(() => ({ cart: newCart, cartItemData: newCartItemData }));
  },
  setItemQuantity: (product, quantity) => {
    const newCart = [...state().cart].map((item) =>
      item.product.id === product.id ? { ...item, quantity } : item
    );
    set(() => ({ cart: newCart }));
    storeCartInLocalStorage(newCart);
  },
  isProductInCart: (product) => isProductInCart(product, state().cart),
  clearCart: () => {
    set(() => ({ cart: [], cartItemData: {} }));
    storeCartInLocalStorage([]);
    storeCartItemDataInLocalStorage({});
  },
  shippingMethods: [],
  setShippingMethods: (shippingMethods) => set(() => ({ shippingMethods })),
  shippingMethod: null,
  setShippingMethod: (id) =>
    set(() => ({ shippingMethod: state().shippingMethods.find((item) => item.id === id) })),
  getTotalPrice: () => {
    return state().cart.reduce((acc, item) => {
      const product = state().cartItemData[item.product.id];
      if (product === undefined) return acc;
      return acc + product.price * item.quantity;
    }, 0);
  },
  getTotalTPS: () => {
    return state().getTotalPrice() * 0.05;
  },
  getTotalTVQ: () => {
    return state().getTotalPrice() * 0.09975;
  },
  getCartTotal: () => {
    return state().getTotalPrice() + state().getTotalTPS() + state().getTotalTVQ();
  },
  getCartTotalQuantity: () => {
    return state().cart.reduce((acc, item) => acc + item.quantity, 0);
  },
  isShippingFree: () => {
    return state().getCartTotalQuantity() >= 4 || state().getTotalPrice() >= 150;
  },
  getShippingPrice: () => {
    if (!state().shippingMethod || state().isShippingFree()) return 0;
    return state().shippingMethod!.price;
  },
  getTotal: () => {
    return (
      state().getTotalPrice() +
      state().getTotalTPS() +
      state().getTotalTVQ() +
      state().getShippingPrice()
    );
  },
}));
