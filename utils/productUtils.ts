import { Hardware, Material, CustomProduct, Product } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export type CustomProductWithComponents = CustomProduct & {
  material: Material;
  hardware: Hardware;
};

export const isCustomProduct = (product: Product | CustomProduct): product is CustomProduct => {
  return (
    (product as CustomProduct).material_id !== undefined &&
    (product as CustomProduct).hardware_id !== undefined
  );
};

export const getMaterialId = (product: Product | CustomProduct) => {
  return isCustomProduct(product) ? product.material_id : undefined;
};

export const getHardwareId = (product: Product | CustomProduct) => {
  return isCustomProduct(product) ? product.hardware_id : undefined;
};

export const getProductMaxQuantity = (product: Product | CustomProduct) => {
  if (isCustomProduct(product)) {
    return 100;
  }
  return product.quantity;
};

export const getClosestValidQuantity = (
  desiredQuantity: number,
  product: Product | CustomProduct
) => {
  const quantity = Math.min(desiredQuantity, getProductMaxQuantity(product));
  return quantity > 0 ? quantity : 1;
};

export const isCustomProductInCollection = (
  product: CustomProduct,
  productCollection: (Product | CustomProduct)[]
) => {
  return productCollection.some(
    (item) =>
      isCustomProduct(item) &&
      item.material_id === product.material_id &&
      item.hardware_id === product.hardware_id
  );
};

export const generateProductName = (material: Material, hardware: Hardware): string => {
  return `${material.name}, ${hardware.name} ${hardware.color}`;
};

export const customProductFactory = (
  material: Material,
  hardware: Hardware
): CustomProductWithComponents => {
  return {
    id: uuidv4(),
    name: generateProductName(material, hardware),
    price: material.price + hardware.price,
    quantity: 1,
    material_id: material.id,
    material,
    hardware_id: hardware.id,
    hardware,
    clientOrderId: null,
    checkoutSessionId: null,
  };
};
