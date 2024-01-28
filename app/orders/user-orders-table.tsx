"use client";

import { Button } from "@/components/ui/button";
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
import type { CustomProductWithComponents } from "@/lib/productUtils";
import { dayjs, orderStatus } from "@/lib/utils";
import type { ClientOrder, Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function UserOrdersTable({ orders }: { orders: ClientOrder[] }) {
  const router = useRouter();
  const isDesktop = useMediaQuery(gtSm);

  const tableItems = useMemo(() => {
    return orders.map((order) => {
      let products: Product[] = [];
      let customProducts: CustomProductWithComponents[] = [];
      if (order.products) products = order.products as Product[];
      if (order.custom_products)
        customProducts = order.custom_products as CustomProductWithComponents[];
      const items = [...products, ...customProducts].map((product) => product.name);
      return (
        <TableRow
          className="h-12 cursor-pointer"
          onClick={() => router.push(`/orders/${order.id}`)}
          key={order.id}
        >
          <TableCell>
            <Button variant="link" className="underline text-primary font-semibold">
              #{order.order_no}
            </Button>
          </TableCell>
          <TableCell>{dayjs(order.created_at).format("D MMM YYYY")}</TableCell>
          {isDesktop && (
            <TableCell className="flex flex-col">
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

  if (!orders.length) {
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
  );
}
