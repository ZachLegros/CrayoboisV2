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
import { cad } from "@/lib/currencyFormatter";
import { useMediaQuery } from "@/lib/hooks";
import { gtSm } from "@/lib/mediaQueries";
import type { CustomProduct, WithComponents } from "@/lib/productUtils";
import { orderStatus } from "@/lib/utils";
import { dayjs } from "@/lib/utils";
import type { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { getUserOrders } from "./actions";
import useUserOrdersStore from "./store";

export default async function OrdersPage() {
  const { orders, setOrders, countOrders } = useUserOrdersStore();
  const router = useRouter();
  const isDesktop = useMediaQuery(gtSm);

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
          <TableCell className="text-right">{orderStatus(order.status)}</TableCell>
        </TableRow>
      );
    });
  }, [orders, isDesktop]);

  if (orders === null)
    return (
      <div className="animate-in flex flex-auto flex-col justify-center items-center gap-3">
        <h3 className="text-xl font-semibold text-center">
          Chargement de vos commandes
        </h3>
        <Spinner className="text-primary size-10" />
      </div>
    );

  if (countOrders() === 0) {
    return (
      <div className="flex flex-col flex-auto justify-center items-center m-5">
        <h3 className="text-xl md:text-2xl font-semibold text-center">
          Vous n'avez pas encore passé de commandes.
        </h3>
        <div className="flex flex-wrap gap-2 items-center justify-center mt-5">
          <Button onClick={() => router.push("/custom-order")}>
            Commander sur mesure
          </Button>
          <Button onClick={() => router.push("/products")}>Voir les produits</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <p className="text-2xl font-semibold mb-4">Mes commandes</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Num. de commande</TableHead>
            <TableHead>Date</TableHead>
            {isDesktop && <TableHead>Items</TableHead>}
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{tableItems}</TableBody>
      </Table>
    </div>
  );
}
