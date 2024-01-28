"use client";

import OrderBreakdown from "@/components/OrderBreakdown";
import { useEffect } from "react";
import useAdminStore from "../../store";
import { getOrders } from "../actions";
import OrderHeader from "./order-header";

export default async function Order({ params }: { params: { id: string } }) {
  const { id } = params;
  const { orders, setOrders } = useAdminStore();
  const order = orders[id] ?? null;

  useEffect(() => {
    if (!order) getOrders().then((orders) => setOrders(orders));
  }, [order]);

  if (!order) return null;

  return (
    <div className="flex flex-col gap-3 md:p-3 md:border rounded-xl">
      <OrderHeader order={order} />
      <OrderBreakdown order={order} />
    </div>
  );
}
