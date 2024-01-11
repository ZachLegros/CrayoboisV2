import { Shipping } from "@prisma/client";
import { Cart, CartItemData } from "./store";

export const getTotalPrice = (cart: Cart, cartItemData: CartItemData) => {
  return cart.reduce((acc, item) => {
    const product = cartItemData[item.product.id];
    if (product === undefined) return acc;
    return acc + product.price * item.quantity;
  }, 0);
};

export const getTotalTPS = (cart: Cart, cartItemData: CartItemData) => {
  return getTotalPrice(cart, cartItemData) * 0.05;
};

export const getTotalTVQ = (cart: Cart, cartItemData: CartItemData) => {
  return getTotalPrice(cart, cartItemData) * 0.09975;
};

export const getShippingPrice = (shippingMethod: Shipping) => {
  return shippingMethod?.price ?? 0;
};

export const getTotal = (
  cart: Cart,
  cartItemData: CartItemData,
  shippingMethod: Shipping
) => {
  return (
    getTotalPrice(cart, cartItemData) +
    getTotalTPS(cart, cartItemData) +
    getTotalTVQ(cart, cartItemData) +
    getShippingPrice(shippingMethod)
  );
};

export const getCartTotalQuantity = (cart: Cart) => {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

export const isShippingFree = (totalQuantity: number, totalPrice: number) => {
  return totalQuantity >= 4 || totalPrice >= 150;
};
