"use server";

import {
  NonNullabbleProduct,
  NonNullabbleProductWithComponents,
  ProductWithComponents,
  customProductFactory,
} from "@/utils/customProductFactory";
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";

export const fetchProducts = async (
  normalProductsFromLS: Product[],
  customProductsFromLS: NonNullabbleProduct[]
): Promise<(Product | ProductWithComponents)[]> => {
  const [products, materials, hardwares] = await Promise.all([
    prisma.product.findMany({
      where: { id: { in: normalProductsFromLS.map((item) => item.id) }, quantity: { gt: 0 } },
    }),
    prisma.material.findMany({
      where: {
        id: { in: customProductsFromLS.map((item) => item.material_id) },
        quantity: { gt: 0 },
      },
    }),
    prisma.hardware.findMany({
      where: {
        id: { in: customProductsFromLS.map((item) => item.hardware_id) },
        quantity: { gt: 0 },
      },
    }),
  ]);

  // merge the custom products with the fetched corresponding materials and hardwares to form a CustomProduct type or discard the custom product if the corresponding material or hardware is not found
  const customProducts = customProductsFromLS
    .map((item) => {
      const material = materials.find((m) => m.id === item.material_id);
      const hardware = hardwares.find((h) => h.id === item.hardware_id);
      if (material && hardware) {
        return customProductFactory(material, hardware);
      }
    })
    .filter((item): item is NonNullabbleProductWithComponents => !!item);

  return [...products, ...customProducts];
};
