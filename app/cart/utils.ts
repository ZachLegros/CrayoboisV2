import { Shipping } from "@prisma/client";
import { CartItemType } from "./store";

export const getTotalPrice = (cart: readonly CartItemType[]) => {
  return cart.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);
};

export const getTotalTPS = (cart: readonly CartItemType[]) => {
  return cart.reduce((acc, item) => {
    return acc + item.product.price * item.quantity * 0.05;
  }, 0);
};

export const getTotalTVQ = (cart: readonly CartItemType[]) => {
  return cart.reduce((acc, item) => {
    return acc + item.product.price * item.quantity * 0.09975;
  }, 0);
};

export const getCartTotalQuantity = (cart: readonly CartItemType[]) => {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

export const isShippingFree = (cart: readonly CartItemType[]) => {
  return getCartTotalQuantity(cart) >= 4 || getTotalPrice(cart) >= 150;
};

export const getShippingPrice = (shippingMethod: Shipping, cart: readonly CartItemType[]) => {
  if (!shippingMethod || isShippingFree(cart)) return 0;
  return shippingMethod.price;
};

export const getTotal = (param: { cart: readonly CartItemType[]; shippingMethod: Shipping }) => {
  const { cart, shippingMethod } = param;
  return (
    getTotalPrice(cart) +
    getTotalTPS(cart) +
    getTotalTVQ(cart) +
    getShippingPrice(shippingMethod, cart)
  );
};
