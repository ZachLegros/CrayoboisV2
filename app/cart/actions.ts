"use server";

import {
  CustomProductWithComponents,
  customProductFactory,
  getClosestValidQuantity,
} from "@/utils/productUtils";
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";
import { CartItemType, CartProductType, isCartCustomProduct, isCartItemType } from "./store";

export const syncCartWithComponents = async (cart: CartItemType<CartProductType>[]) => {
  try {
    const syncedCartWithComponents: CartItemType<Product | CustomProductWithComponents>[] = [];
    for (const item of cart) {
      if (isCartItemType(item)) {
        if (item.product && isCartCustomProduct(item.product)) {
          const [material, hardware] = await Promise.all([
            prisma.material.findUnique({ where: { id: item.product.material_id } }),
            prisma.hardware.findUnique({ where: { id: item.product.hardware_id } }),
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
    console.error("Failed to sync cart:", cart);
    return [];
  }
};

export const syncCart = async (cart: CartItemType<CartProductType>[]) => {
  try {
    const syncedCart: CartItemType<Product | CustomProductWithComponents>[] = [];
    for (const item of cart) {
      if (isCartItemType(item)) {
        if (item.product && isCartCustomProduct(item.product)) {
          const [material, hardware] = await Promise.all([
            prisma.material.findUnique({ where: { id: item.product.material_id } }),
            prisma.hardware.findUnique({ where: { id: item.product.hardware_id } }),
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

// export const fetchProducts = async (
//   normalProductIdsFromLS: string[],
//   customProductIdsFromLS: { material_id: string; hardware_id: string }[]
// ): Promise<(Product | CustomProductWithComponents)[]> => {
//   const [products, materials, hardwares] = await Promise.all([
//     prisma.product.findMany({
//       where: { id: { in: normalProductIdsFromLS }, quantity: { gt: 0 } },
//     }),
//     prisma.material.findMany({
//       where: {
//         id: { in: customProductIdsFromLS.map((item) => item.material_id) },
//       },
//     }),
//     prisma.hardware.findMany({
//       where: {
//         id: { in: customProductIdsFromLS.map((item) => item.hardware_id) },
//       },
//     }),
//   ]);

//   // merge the custom products with the fetched corresponding materials and hardwares to form a CustomProduct type or discard the custom product if the corresponding material or hardware is not found
//   const customProducts = customProductIdsFromLS
//     .map((item) => {
//       const material = materials.find((m) => m.id === item.material_id);
//       const hardware = hardwares.find((h) => h.id === item.hardware_id);
//       if (material && hardware) {
//         return customProductFactory(material, hardware);
//       }
//     })
//     .filter((item): item is CustomProductWithComponents => !!item);

//   return [...products, ...customProducts];
// };

export const fetchShippingMethods = async () => {
  return await prisma.shipping.findMany();
};
