import { ItemImages } from "@/app/cart/cart-item";
import { cad } from "@/lib/currencyFormatter";
import type { DbProduct } from "@/lib/productUtils";
import { dayjs, getNetAmount, getTps, getTvq } from "@/lib/utils";
import type { ClientOrder } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function OrderBreakdown(props: { order: ClientOrder }) {
  const { order } = props;

  let products: DbProduct[] = [];

  if (Array.isArray(order.products))
    products = [...products, ...(order.products as DbProduct[])];
  if (Array.isArray(order.custom_products))
    products = [...products, ...(order.custom_products as DbProduct[])];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <h2 className="text-xl font-semibold mb-1">Informations génerales</h2>
          <ul className="flex flex-col gap-0.5">
            <li>
              <b>Nom:</b> {order.payer_name}
            </li>
            <li>
              <b>Email:</b> {order.payer_email}
            </li>
            <li>
              <b>Date:</b> {dayjs(order.created_at).format("D MMMM YYYY")}
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-1">Addresse de livraison</h2>
          <ul className="flex flex-col gap-0.5">
            <li>
              <b>Addresse:</b> {order.address_street}
            </li>
            <li>
              <b>Ville:</b> {order.address_city}, {order.address_state},{" "}
              {order.address_country}
            </li>
            <li>
              <b>Code postal:</b> {order.address_zip}
            </li>
          </ul>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Commande #{order.order_no}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">Sous-total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex rounded-sm overflow-hidden w-[75px] md:w-[150px] h-max">
                    <ItemImages product={product} />
                  </div>
                </TableCell>
                <TableCell className="capitalize">{product.name}</TableCell>
                <TableCell className="text-right">{product.quantity}</TableCell>
                <TableCell className="text-right">
                  {cad(product.price * product.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                Sous-total
              </TableCell>
              <TableCell className="text-right">
                {cad(getNetAmount(order))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                TPS
              </TableCell>
              <TableCell className="text-right">
                {cad(getTps(getNetAmount(order)))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                TVQ
              </TableCell>
              <TableCell className="text-right">
                {cad(getTvq(getNetAmount(order)))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                Livraison
              </TableCell>
              <TableCell className="text-right">{cad(order.shipping)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                Total
              </TableCell>
              <TableCell className="text-right">{cad(order.amount)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
