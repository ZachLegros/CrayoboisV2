import type { CartCustomProduct, CartItemType, CartProductType } from "./types";

export const isCartCustomProduct = (
  cartProduct: CartProductType,
): cartProduct is CartCustomProduct => {
  return (
    (cartProduct as CartCustomProduct).material_id !== undefined &&
    (cartProduct as CartCustomProduct).hardware_id !== undefined
  );
};

export const isCartItemType = (
  item: CartItemType<CartProductType>,
): item is CartItemType<CartProductType> => {
  return item.product !== undefined && !Number.isNaN(item.quantity);
};

export const getCartProductMaterialId = (product: CartProductType) => {
  return isCartCustomProduct(product) ? product.material_id : undefined;
};

export const getCartProductHardwareId = (product: CartProductType) => {
  return isCartCustomProduct(product) ? product.hardware_id : undefined;
};

export const isShippingFree = (totalQuantity: number, totalItemsPrice: number) => {
  return totalQuantity >= 4 || totalItemsPrice >= 150;
};
