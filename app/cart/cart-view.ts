"use client";

import { DbProduct, getHardwareId, getMaterialId } from "@/lib/productUtils";
import { getTps, getTvq } from "@/lib/utils";
import { Shipping } from "@prisma/client";
import { fetchShippingMethods, syncCart as syncCartAction } from "./actions";

export type CartProduct = { id: string };
export type CartCustomProduct = CartProduct & {
  material_id: string;
  hardware_id: string;
};
export type CartProductType = CartProduct | CartCustomProduct;
export type CartItemData = {
  [key: string]: DbProduct | undefined;
};
export type CartItems = CartItemType<CartProductType>[];

export type PriceBreakdown = {
  subtotal: number;
  tps: number;
  tvq: number;
  shipping: number;
  total: number;
};

export type CartItemType<T> = {
  product: T;
  quantity: number;
};

export const isCartItemType = (
  item: CartItemType<CartProductType>,
): item is CartItemType<CartProductType> => {
  return item.product !== undefined && !Number.isNaN(item.quantity);
};

export class Cart {
  items: CartItems = [];
  itemData: CartItemData = {};
  shipping: Shipping | null = null;
  shippingMethods: Shipping[] = [];
  breakdown: PriceBreakdown = {
    subtotal: 0,
    tps: 0,
    tvq: 0,
    shipping: 0,
    total: 0,
  };

  constructor() {
    this.items = this.getCartFromLocalStorage();
    this.itemData = this.getCartItemDataFromLocalStorage();
  }

  private setItems = (items: CartItems) => {
    this.items = items;
    this.inferShippingMethod();
    this.inferBreakdown();
    this.setItemsInLocalStorage(items);
  };

  private setItemData = (itemData: CartItemData) => {
    this.itemData = itemData;
    this.setItemDataInLocalStorage(itemData);
  };

  addItem = (product: DbProduct) => {
    const alreadyInCart = this.has(product.id);
    if (alreadyInCart) return;
    const newCartItems = [
      ...this.items,
      {
        product: {
          id: product.id,
          material_id: getMaterialId(product),
          hardware_id: getHardwareId(product),
        },
        quantity: 1,
      },
    ];
    const newCartItemData = { ...this.itemData, [product.id]: product };
    this.setItems(newCartItems);
    this.setItemData(newCartItemData);
  };

  removeItem = (productId: string) => {
    const newCartItems = this.items.filter((item) => item.product.id !== productId);
    const newCartItemData = {
      ...this.itemData,
      [productId]: undefined,
    };
    this.setItems(newCartItems);
    this.setItemData(newCartItemData);
  };

  updateItem = <P extends keyof CartItemType<CartProductType>>(
    productId: string,
    property: P,
    value: CartItemType<CartProductType>[P],
  ) => {
    const newCartItems: CartItems = [...this.items].map((item) =>
      item.product.id === productId ? { ...item, [property]: value } : item,
    );
    this.setItems(newCartItems);
  };

  has = (productId: string) => {
    return this.items.some((item) => item.product.id === productId);
  };

  clear = () => {
    this.setItems([]);
    this.setItemData({});
  };

  getTotalItemsPrice = () => {
    return this.items.reduce((acc, item) => {
      const product = this.itemData[item.product.id];
      if (product === undefined) return acc;
      return acc + product.price * item.quantity;
    }, 0);
  };

  getTotalQuantity = () => {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  };

  private inferBreakdown = () => {
    if (!this.shipping) {
      return {
        subtotal: 0,
        tps: 0,
        tvq: 0,
        shipping: 0,
        total: 0,
      };
    }
    const subtotal = this.getTotalItemsPrice();
    const tps = getTps(subtotal);
    const tvq = getTvq(subtotal);
    const shippingPrice = this.shipping.price;
    this.breakdown = {
      subtotal,
      tps,
      tvq,
      shipping: shippingPrice,
      total: subtotal + tps + tvq + shippingPrice,
    };
  };

  sync = async () => {
    const lastSync = parseInt(safeLocalStorageGet("lastSync") ?? "0");
    if (lastSync && Date.now() - lastSync < 1000 * 60 * 60) return;

    const syncedCart = await syncCartAction(this.items);
    const newCartItems: CartItems = syncedCart.map(({ product, quantity }) => ({
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
    safeLocalStorageSet("lastSync", Date.now().toString());
    this.setItems(newCartItems);
    this.setItemData(newCartItemData);
  };

  fetchShippingMethods = async () => {
    fetchShippingMethods().then((shippingMethods) => {
      this.shippingMethods = shippingMethods;
      this.inferShippingMethod();
    });
  };

  setShippingMethod = (id: string) => {
    const correspondingMethod = this.shippingMethods.find((item) => item.id === id);
    this.shipping = correspondingMethod ?? null;
  };

  inferShippingMethod = () => {
    const freeMethod = this.shippingMethods.filter(
      (method) => method.price === 0,
    )[0];
    const nonFreeMethods = this.shippingMethods
      .filter((method) => method.price !== 0)
      .sort((a, b) => a.price - b.price);
    if (isShippingFree(this.getTotalQuantity(), this.getTotalItemsPrice())) {
      this.shipping = freeMethod;
    } else if (this.shipping?.price === 0) {
      // reset to cheapest non-free method
      this.shipping = nonFreeMethods[0];
    }
    return;
  };

  private getCartFromLocalStorage = (): CartItems => {
    const cartString = safeLocalStorageGet("cart");
    const cart: CartItems = cartString ? JSON.parse(cartString) : [];
    return cart;
  };

  private getCartItemDataFromLocalStorage = (): CartItemData => {
    const itemDataString = safeLocalStorageGet("itemData");
    const itemData = itemDataString ? JSON.parse(itemDataString) : {};
    return itemData;
  };

  private setItemsInLocalStorage = (items: CartItems) => {
    safeLocalStorageSet("cart", JSON.stringify(items));
  };

  private setItemDataInLocalStorage = (itemData: CartItemData) => {
    safeLocalStorageSet("itemData", JSON.stringify(itemData));
  };
}

export const isCartCustomProduct = (
  cartProduct: CartProductType,
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

export const isShippingFree = (totalQuantity: number, totalItemsPrice: number) => {
  return totalQuantity >= 4 || totalItemsPrice >= 150;
};

export function safeLocalStorageGet(key: string) {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(key);
}

export function safeLocalStorageSet(key: string, value: string) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, value);
}
