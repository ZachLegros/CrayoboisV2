import { ClientOrder } from "@prisma/client";

export const primaryColor = "#b43e00";

export function getNetAmount(order: ClientOrder) {
  return order.amount - order.tax - order.shipping;
}
