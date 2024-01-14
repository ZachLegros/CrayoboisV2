import { DbProduct } from "@/lib/productUtils";
import { CartItemType } from "../cart/store";
import Stripe from "stripe";

export function getTotalAmount(cart: CartItemType<DbProduct>[]) {
  return cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
}

export function getTotalTps(cart: CartItemType<DbProduct>[]) {
  return 0.05 * getTotalAmount(cart);
}

export function getTotalTvq(cart: CartItemType<DbProduct>[]) {
  return 0.09975 * getTotalAmount(cart);
}

export function inCents(price: number) {
  return Math.round(price * 100);
}

export function orZero(value: number | null | undefined) {
  return value ?? 0;
}

export function getLineItems(
  cart: CartItemType<DbProduct>[]
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return cart.map((item) => {
    return {
      price_data: {
        currency: "cad",
        product_data: {
          name: item.product.name,
        },
        unit_amount: inCents(item.product.price),
      },
      quantity: item.quantity,
    };
  });
}
