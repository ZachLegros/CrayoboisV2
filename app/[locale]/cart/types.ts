import type { DbProduct } from "@/lib/productUtils";
import type { Shipping } from "@prisma/client";

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

export type CartState = {
  items: CartItems;
  itemData: CartItemData;
  shipping: Shipping | null;
  shippingMethods: Shipping[];
  breakdown: PriceBreakdown;
};
