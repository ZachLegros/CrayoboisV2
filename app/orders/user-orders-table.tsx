"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { dayjs } from "@/lib/utils";
import type { ClientOrder } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserOrdersTable({ orders }: { orders: ClientOrder[] }) {
  const router = useRouter();

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
    <div>
      <h3 className="text-xl font-semibold">Mes commandes</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link href={`/orders/${order.id}`}>{order.id}</Link>
              </TableCell>
              <TableCell>{order.amount}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{dayjs(order.created_at).format("DD MMM YYYY")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
