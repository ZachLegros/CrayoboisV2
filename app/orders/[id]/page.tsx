"use client";

import FloatingBar from "@/components/FloatingBar";
import OrderBreakdown from "@/components/OrderBreakdown";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { getUserOrders } from "../actions";
import Loading from "../loading";
import useUserOrdersStore from "../store";

export default function UserOrderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { orders, setOrders } = useUserOrdersStore();
  const order = orders?.[id] ?? null;

  useEffect(() => {
    if (!order) {
      getUserOrders().then((orders) => {
        const ordersMap = setOrders(orders);
        const currentOrderExists = !!ordersMap?.[id];
        if (!currentOrderExists) router.push("/orders");
      });
    }
  }, [order]);

  if (!order) return <Loading />;

  return (
    <div className="animate-in flex flex-col gap-3">
      <div className="hidden sm:flex justify-between">
        <Button className="w-max" onClick={() => router.push("/orders")}>
          <FaChevronLeft className="mr-1" />
          Mes commandes
        </Button>
      </div>
      <OrderBreakdown order={order} />
      <FloatingBar className="flex sm:hidden p-3 pb-6">
        <Button
          className="w-max text-lg drop-shadow-lg p-4 pointer-events-auto"
          onClick={() => router.push("/orders")}
        >
          <FaChevronLeft className="mr-1" />
          Mes commandes
        </Button>
      </FloatingBar>
    </div>
  );
}
