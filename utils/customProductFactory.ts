import { CustomProduct, Hardware, Material } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const generateProductName = (material: Material, hardware: Hardware): string => {
  return `${material.name}, ${hardware.name} ${hardware.color}`;
};

export const customProductFactory = (material: Material, hardware: Hardware): CustomProduct => {
  return {
    id: uuidv4(),
    name: generateProductName(material, hardware),
    price: material.price + hardware.price,
    quantity: 1,
    material_id: material.id,
    hardware_id: hardware.id,
  };
};
