import { Product, Hardware, Material } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export type NonNullabbleProduct = {
  [K in keyof Product]: NonNullable<Product[K]>;
};

export type ProductWithComponents = Product & {
  material: Material;
  hardware: Hardware;
};

export type NonNullabbleProductWithComponents = {
  [K in keyof ProductWithComponents]: NonNullable<ProductWithComponents[K]>;
};

const generateProductName = (material: Material, hardware: Hardware): string => {
  return `${material.name}, ${hardware.name} ${hardware.color}`;
};

export const customProductFactory = (
  material: Material,
  hardware: Hardware
): ProductWithComponents => {
  return {
    id: uuidv4(),
    name: generateProductName(material, hardware),
    price: material.price + hardware.price,
    quantity: 1,
    is_custom: true,
    image: null,
    description: null,
    material_id: material.id,
    hardware_id: hardware.id,
    material,
    hardware,
  };
};
