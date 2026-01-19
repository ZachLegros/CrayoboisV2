"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "@/i18n/navigation";
import { cad } from "@/lib/currencyFormatter";
import { useMediaQuery } from "@/lib/hooks";
import { gtSm } from "@/lib/mediaQueries";
import type { CustomProduct, WithComponents } from "@/lib/productUtils";
import { dayjs } from "@/lib/utils";
import type { OrderStatus, Product } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { getUserOrders } from "./actions";
import useUserOrdersStore from "./store";

export default function OrdersPage() {
  const { orders, setOrders, countOrders } = useUserOrdersStore();
  const router = useRouter();
  const isDesktop = useMediaQuery(gtSm);
  const t = useTranslations("orders");
  const tStatus = useTranslations("orderStatus");
  const tCart = useTranslations("cart");

  const getOrderStatusLabel = (status: OrderStatus) => {
    return tStatus(status);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getUserOrders();
      setOrders(orders);
    };
    if (orders === null) fetchOrders();
  }, [orders]);

  const tableItems = useMemo(() => {
    if (orders === null) return null;
    return Object.keys(orders).map((orderId) => {
      const order = orders[orderId];
      let products: Product[] = [];
      let customProducts: CustomProduct<WithComponents>[] = [];
      if (order.products) products = order.products as Product[];
      if (order.custom_products)
        customProducts = order.custom_products as CustomProduct<WithComponents>[];
      const items = [...products, ...customProducts].map((product) => product.name);
      return (
        <TableRow
          className="h-12 cursor-pointer"
          onClick={() => router.push(`/orders/${order.id}`)}
          key={order.id}
        >
          <TableCell>
            <Button
              variant="link"
              className="underline text-primary font-semibold w-max p-0"
            >
              #{order.order_no}
            </Button>
          </TableCell>
          <TableCell>{dayjs(order.created_at).format("D MMM YYYY")}</TableCell>
          {isDesktop && (
            <TableCell>
              <ul>
                {items.map((item, index) => (
                  <li
                    className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px]"
                    key={item}
                  >
                    {items.length > 1 && (
                      <span className="font-semibold ">{index + 1}.</span>
                    )}{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </TableCell>
          )}
          <TableCell>{cad(order.amount)}</TableCell>
          <TableCell className="text-right">
            {getOrderStatusLabel(order.status)}
          </TableCell>
        </TableRow>
      );
    });
  }, [orders, isDesktop]);

  if (orders === null)
    return (
      <div className="animate-in flex flex-auto flex-col justify-center items-center gap-3">
        <h3 className="text-xl font-semibold text-center">{t("loading")}</h3>
        <Spinner className="text-primary size-10" />
      </div>
    );

  if (countOrders() === 0) {
    return (
      <div className="flex flex-col flex-auto justify-center items-center m-5">
        <h3 className="text-xl md:text-2xl font-semibold text-center">
          {t("noOrders")}
        </h3>
        <div className="flex flex-wrap gap-2 items-center justify-center mt-5">
          <Button onClick={() => router.push("/custom-order")}>
            {tCart("orderCustom")}
          </Button>
          <Button onClick={() => router.push("/products")}>
            {tCart("viewProducts")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <p className="text-2xl font-semibold mb-4">{t("title")}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t("orderNumber")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            {isDesktop && <TableHead>{t("items")}</TableHead>}
            <TableHead>{t("total")}</TableHead>
            <TableHead className="text-right">{t("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{tableItems}</TableBody>
      </Table>
    </div>
  );
}
