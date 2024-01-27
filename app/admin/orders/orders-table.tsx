"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cad } from "@/lib/currencyFormatter";
import { dayjs } from "@/lib/utils";
import { type ClientOrder, OrderStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import useAdminStore from "../store";

export default function OrdersTable(props: { orders: ClientOrder[] }) {
  const { orders: ordersFromDb } = props;
  const router = useRouter();
  const { orders, setOrders } = useAdminStore();

  const tableItems = useMemo(() => {
    return Object.keys(orders).map((orderId) => {
      const order = orders[orderId];
      return (
        <TableRow
          className="h-12 cursor-pointer"
          key={order.id}
          onClick={() => router.push(`/admin/orders/${order.id}`)}
        >
          <TableCell className="font-medium">#{order.order_no}</TableCell>
          <TableCell>{dayjs(order.created_at).format("D MMM YYYY")}</TableCell>
          <TableCell className="capitalize">{order.payer_name}</TableCell>
          <TableCell>{cad(order.amount)}</TableCell>
          <TableCell className="text-right">{orderStatus(order.status)}</TableCell>
        </TableRow>
      );
    });
  }, [orders]);

  useEffect(() => {
    if (Object.keys(orders).length === 0) setOrders(ordersFromDb);
  }, [ordersFromDb]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{tableItems}</TableBody>
    </Table>
  );
}

function orderStatus(status: OrderStatus) {
  switch (status) {
    case OrderStatus.pending:
      return "En attente";
    case OrderStatus.shipped:
      return "Livrée";
    case OrderStatus.cancelled:
      return "Annulée";
    default:
      return status;
  }
}
