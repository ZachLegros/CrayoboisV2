import { hexTransp } from "@/lib/utils";
import { ClientOrder } from "@prisma/client";
import colors from "tailwindcss/colors";

export const chartPrimary = "#b43e00";

export const chartSecondary = `${colors.slate[500]}${hexTransp(25)}`;

export const chartBgLight = "hsl(var(--background))";

export const chartBgDark = "hsl(var(--secondary))";

export function getNetAmount(order: ClientOrder) {
  return order.amount - order.tax - order.shipping;
}
