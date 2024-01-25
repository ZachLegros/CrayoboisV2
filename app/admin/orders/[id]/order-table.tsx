"use client";

import { DbProduct } from "@/lib/productUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cad } from "@/lib/currencyFormatter";
import { ItemImages } from "@/app/cart/cart-item";
import { getNetAmount } from "../../common";
import { ClientOrder } from "@prisma/client";
import { getTps, getTvq } from "../../../../lib/utils";

export default function OrdersTable(props: { order: ClientOrder }) {
  const { order } = props;

  let products: DbProduct[] = [];

  if (Array.isArray(order.products))
    products = [...products, ...(order.products as DbProduct[])];
  if (Array.isArray(order.custom_products))
    products = [...products, ...(order.custom_products as DbProduct[])];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Prix unitaire</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead className="text-right">Sous-total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex rounded-sm overflow-hidden max-w-[150px] h-max">
                <ItemImages product={product} />
              </div>
            </TableCell>
            <TableCell className="capitalize">{product.name}</TableCell>
            <TableCell>{cad(product.price)}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell className="text-right">
              {cad(product.price * product.quantity)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4} className="text-right">
            Sous-total
          </TableCell>
          <TableCell className="text-right">
            {cad(getNetAmount(order))}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={4} className="text-right">
            TPS
          </TableCell>
          <TableCell className="text-right">
            {cad(getTps(getNetAmount(order)))}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={4} className="text-right">
            TVQ
          </TableCell>
          <TableCell className="text-right">
            {cad(getTvq(getNetAmount(order)))}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={4} className="text-right">
            Livraison
          </TableCell>
          <TableCell className="text-right">{cad(order.shipping)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={4} className="text-right">
            Total
          </TableCell>
          <TableCell className="text-right">{cad(order.amount)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
