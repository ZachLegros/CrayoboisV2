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
    <>
      <OrderHeader order={order} />
      <OrderBreakdown order={order} />
    </>
  );
}
