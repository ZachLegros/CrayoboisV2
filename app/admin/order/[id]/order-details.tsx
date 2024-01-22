import { ClientOrder } from "@prisma/client";
import { dayjs } from "@/lib/utils";
import OrderTable from "./order-table";

export default function OrderDetails(props: { order: ClientOrder }) {
  const { order } = props;

  return (
    <div className="flex flex-col gap-3 p-3 border rounded-xl">
      <div className="grid grid-cols-2">
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
        <OrderTable order={order} />
      </div>
    </div>
  );
}
