import type {
  CustomProduct as PrismaCustomProduct,
  Hardware,
  Material,
  Product,
} from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export type CustomProduct<T = void> = PrismaCustomProduct & T;

export type DbProduct = Product | CustomProduct | CustomProduct<WithComponents>;

export type WithComponents = {
  material: Material;
  hardware: Hardware;
};

export const isProduct = (product: DbProduct): product is Product => {
  return (
    isCustomProduct(product) === false &&
    isCustomProductWithComponents(product) === false
  );
};

export const isCustomProduct = (product: DbProduct): product is CustomProduct => {
  return (
    (product as CustomProduct).material_id !== undefined &&
    (product as CustomProduct).hardware_id !== undefined
  );
};

export const isCustomProductWithComponents = (
  product: DbProduct,
): product is CustomProduct<WithComponents> => {
  return (
    (product as CustomProduct<WithComponents>).material !== undefined &&
    (product as CustomProduct<WithComponents>).hardware !== undefined
  );
};

export const isMaterial = (
  component: Material | Hardware,
): component is Material => {
  return (component as Material).origin !== undefined;
};

export const isHardware = (
  component: Material | Hardware,
): component is Hardware => {
  return (
    (component as Hardware).color !== undefined && isMaterial(component) === false
  );
};

export const getMaterialId = (product: DbProduct) => {
  return isCustomProduct(product) ? product.material_id : undefined;
};

export const getHardwareId = (product: DbProduct) => {
  return isCustomProduct(product) ? product.hardware_id : undefined;
};

export const getProductMaxQuantity = (product: DbProduct) => {
  if (isCustomProduct(product)) {
    return 100;
  }
  return product.quantity;
};

export const getClosestValidQuantity = (
  desiredQuantity: number,
  product: DbProduct,
) => {
  const quantity = Math.min(desiredQuantity, getProductMaxQuantity(product));
  return quantity > 0 ? quantity : 1;
};

export const generateProductName = (
  material: Material,
  hardware: Hardware,
): string => {
  return `${material.name}, ${hardware.name} ${hardware.color}`;
};

export const customProductFactory = (
  material: Material,
  hardware: Hardware,
): CustomProduct<WithComponents> => {
  return {
    id: uuidv4(),
    name: generateProductName(material, hardware),
    price: material.price + hardware.price,
    quantity: 1,
    material_id: material.id,
    material,
    hardware_id: hardware.id,
    hardware,
  };
};
