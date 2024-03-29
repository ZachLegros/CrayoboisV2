"use client";

import type {
  ClientOrder,
  Hardware,
  Material,
  OrderStatus,
  Product,
} from "@prisma/client";
import { create } from "zustand";
import { updateHardwareInDb } from "./hardwares/actions";
import { updateMaterialInDb } from "./materials/actions";
import { updateOrderStatusInDb } from "./orders/actions";
import { updateProductInDb } from "./products/actions";

type AdminStore = {
  orders: { [key: string]: ClientOrder };
  setOrders: (orders: ClientOrder[]) => void;
  updateOrderStatus: (orderId: string, orderStatus: OrderStatus) => Promise<boolean>;

  materials: { [key: string]: Material };
  setMaterial: (material: Material) => void;
  setMaterials: (materials: Material[]) => void;
  updateMaterial: <P extends keyof Material>(
    materialId: string,
    property: P,
    value: Material[P],
  ) => Promise<boolean>;

  hardwares: { [key: string]: Hardware };
  setHardware: (hardware: Hardware) => void;
  setHardwares: (hardwares: Hardware[]) => void;
  updateHardware: <P extends keyof Hardware>(
    hardwareId: string,
    property: P,
    value: Hardware[P],
  ) => Promise<boolean>;

  products: { [key: string]: Product };
  setProduct: (product: Product) => void;
  setProducts: (products: Product[]) => void;
  updateProduct: <P extends keyof Product>(
    productId: string,
    property: P,
    value: Product[P],
  ) => Promise<boolean>;
};

export const useAdminStore = create<AdminStore>((set, get) => ({
  orders: {},
  setOrders: (orders: ClientOrder[]) => {
    const ordersObj: { [orderId: string]: ClientOrder } = {};
    for (const order of orders) {
      ordersObj[order.id] = order;
    }
    set({ orders: ordersObj });
  },
  updateOrderStatus: async (orderId: string, orderStatus: OrderStatus) => {
    const originalOrders = { ...get().orders };
    const updatedOrder = { ...get().orders[orderId], status: orderStatus };
    const newOrders = { ...get().orders, [orderId]: updatedOrder };
    set({ orders: newOrders });
    return updateOrderStatusInDb(orderId, orderStatus).then((success) => {
      if (!success) {
        set({ orders: originalOrders });
      }
      return success;
    });
  },

  materials: {},
  setMaterial: (material: Material) => {
    set({ materials: { ...get().materials, [material.id]: material } });
  },
  setMaterials: (materials: Material[]) => {
    const materialsObj: { [materialId: string]: Material } = {};
    for (const material of materials) {
      materialsObj[material.id] = material;
    }
    set({ materials: materialsObj });
  },
  updateMaterial: async <P extends keyof Material>(
    materialId: string,
    property: P,
    value: Material[P],
  ) => {
    const originalMaterials = { ...get().materials };
    const updatedMaterial = { ...get().materials[materialId], [property]: value };
    const newMaterials = { ...get().materials, [materialId]: updatedMaterial };
    set({ materials: newMaterials });
    return updateMaterialInDb(updatedMaterial).then((success) => {
      if (!success) {
        set({ materials: originalMaterials });
      }
      return success;
    });
  },

  hardwares: {},
  setHardware: (hardware: Hardware) => {
    set({ hardwares: { ...get().hardwares, [hardware.id]: hardware } });
  },
  setHardwares: (hardwares: Hardware[]) => {
    const hardwaresObj: { [hardwareId: string]: Hardware } = {};
    for (const hardware of hardwares) {
      hardwaresObj[hardware.id] = hardware;
    }
    set({ hardwares: hardwaresObj });
  },
  updateHardware: async <P extends keyof Hardware>(
    hardwareId: string,
    property: P,
    value: Hardware[P],
  ) => {
    const originalHardwares = { ...get().hardwares };
    const updatedHardware = { ...get().hardwares[hardwareId], [property]: value };
    const newHardwares = { ...get().hardwares, [hardwareId]: updatedHardware };
    set({ hardwares: newHardwares });
    return updateHardwareInDb(updatedHardware).then((success) => {
      if (!success) {
        set({ hardwares: originalHardwares });
      }
      return success;
    });
  },

  products: {},
  setProduct: (product: Product) => {
    set({ products: { ...get().products, [product.id]: product } });
  },
  setProducts: (products: Product[]) => {
    const productsObj: { [productId: string]: Product } = {};
    for (const product of products) {
      productsObj[product.id] = product;
    }
    set({ products: productsObj });
  },
  updateProduct: async <P extends keyof Product>(
    productId: string,
    property: P,
    value: Product[P],
  ) => {
    let newValue: Product[P] = value;
    if (property === "description" && value === "")
      (newValue as Product["description"]) = null;

    const originalProducts = { ...get().products };
    const updatedProduct = { ...get().products[productId], [property]: newValue };
    const newProducts = { ...get().products, [productId]: updatedProduct };
    set({ products: newProducts });
    return updateProductInDb(updatedProduct).then((success) => {
      if (!success) {
        set({ products: originalProducts });
      }
      return success;
    });
  },
}));

export default useAdminStore;
