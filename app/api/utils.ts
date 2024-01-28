import prisma from "@/lib/prisma";
import {
  type CustomProduct,
  type DbProduct,
  type WithComponents,
  getHardwareId,
  getMaterialId,
} from "@/lib/productUtils";
import { getTps, getTvq } from "@/lib/utils";
import type { Product } from "@prisma/client";
import type Stripe from "stripe";
import type { CartItemType, CartItems } from "../cart/types";
import { getCartProductHardwareId, getCartProductMaterialId } from "../cart/utils";

export function getTotalAmount(cart: CartItemType<DbProduct>[]) {
  return cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
}

export function getTotalTps(cart: CartItemType<DbProduct>[]) {
  return getTps(getTotalAmount(cart));
}

export function getTotalTvq(cart: CartItemType<DbProduct>[]) {
  return getTvq(getTotalAmount(cart));
}

export function inCents(price: number) {
  return Math.round(price * 100);
}

export function orZero(value: number | null | undefined) {
  return value ?? 0;
}

export function getLineItems(
  cart: CartItemType<DbProduct>[],
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

export type FilteredCart = {
  items: CartItemType<Product>[];
  customItems: CartItemType<CustomProduct<WithComponents>>[];
};

export async function createCheckoutSessionInDB(params: {
  sessionId: string;
  cart: FilteredCart;
  expiresAt: Date;
  shippingId: string;
  userId?: string;
}) {
  try {
    const { sessionId, cart, expiresAt, shippingId, userId } = params;
    await prisma.checkoutSession.create({
      data: {
        sid: sessionId,
        expires_at: expiresAt,
        items: {
          create: cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        },
        custom_items: {
          create: cart.customItems.map((item) => ({
            customProduct: {
              create: {
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                material_id: item.product.material_id,
                hardware_id: item.product.hardware_id,
              },
            },
            quantity: item.quantity,
          })),
        },
        shipping_id: shippingId,
        ...(userId && { user_id: userId }),
      },
      include: {
        items: true,
        custom_items: true,
      },
    });
  } catch (err) {
    throw new Error("failed_to_create_session_in_db");
  }
}

export async function deleteCheckoutSessionInDB(checkoutSid: string) {
  try {
    const deleted = await prisma.checkoutSession.delete({
      where: {
        sid: checkoutSid,
      },
    });
    return deleted;
  } catch (err) {
    console.error(err);
  }
}

export function isCartInSync(
  items: CartItems,
  syncedCart: CartItemType<DbProduct>[],
) {
  return items.every((item) =>
    syncedCart.some(
      (syncedItem) =>
        item.product.id === syncedItem.product.id &&
        getCartProductMaterialId(item.product) ===
          getMaterialId(syncedItem.product) &&
        getCartProductHardwareId(item.product) === getHardwareId(syncedItem.product),
    ),
  );
}
