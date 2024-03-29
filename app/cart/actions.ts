"use server";

import prisma from "@/lib/prisma";
import {
  type CustomProduct,
  type WithComponents,
  customProductFactory,
  getClosestValidQuantity,
} from "@/lib/productUtils";
import type { Product } from "@prisma/client";
import type { CartItemType, CartItems } from "./types";
import { isCartCustomProduct, isCartItemType } from "./utils";

export const syncCartWithComponents = async (cart: CartItems) => {
  try {
    const syncedCartWithComponents: CartItemType<
      Product | CustomProduct<WithComponents>
    >[] = [];
    for (const item of cart) {
      if (isCartItemType(item)) {
        if (item.product && isCartCustomProduct(item.product)) {
          const [material, hardware] = await Promise.all([
            prisma.material.findUnique({
              where: { id: item.product.material_id },
            }),
            prisma.hardware.findUnique({
              where: { id: item.product.hardware_id },
            }),
          ]);
          if (material && hardware) {
            const customProduct = customProductFactory(material, hardware);
            syncedCartWithComponents.push({
              product: { ...customProduct, id: item.product.id },
              quantity: getClosestValidQuantity(item.quantity, customProduct),
            });
          }
        } else {
          const product = await prisma.product.findUnique({
            where: { id: item.product.id, quantity: { gt: 0 } },
          });
          if (product) {
            syncedCartWithComponents.push({
              product,
              quantity: getClosestValidQuantity(item.quantity, product),
            });
          }
        }
      }
    }
    return syncedCartWithComponents;
  } catch (error) {
    console.error("Failed to sync cart:", (error as Error).message);
    return [];
  }
};

export const syncCart = async (cart: CartItems) => {
  try {
    const syncedCart: CartItemType<Product | CustomProduct<WithComponents>>[] = [];
    for (const item of cart) {
      if (isCartItemType(item)) {
        if (item.product && isCartCustomProduct(item.product)) {
          const [material, hardware] = await Promise.all([
            prisma.material.findUnique({
              where: { id: item.product.material_id },
            }),
            prisma.hardware.findUnique({
              where: { id: item.product.hardware_id },
            }),
          ]);
          if (material && hardware) {
            const customProduct = customProductFactory(material, hardware);
            syncedCart.push({
              product: { ...customProduct, id: item.product.id },
              quantity: getClosestValidQuantity(item.quantity, customProduct),
            });
          }
        } else {
          const product = await prisma.product.findUnique({
            where: { id: item.product.id, quantity: { gt: 0 } },
          });
          if (product) {
            syncedCart.push({
              product,
              quantity: getClosestValidQuantity(item.quantity, product),
            });
          }
        }
      }
    }
    return syncedCart;
  } catch (error) {
    console.error("Failed to sync cart:", cart);
    return [];
  }
};

export const fetchShippingMethods = async () => {
  return await prisma.shipping.findMany();
};
