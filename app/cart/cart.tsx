"use client";

import CartItem from "./cart-item";
import EmptyCart from "./empty-cart";
import CartBreakdown from "./cart-breakdown";
import { useEffect } from "react";
import { useCartStore } from "./store";
import { Card } from "@/components/ui/card";

export default function Cart() {
  const { cart, syncCart } = useCartStore();

  useEffect(() => {
    syncCart();
  }, []);

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <Card className="animate-in p-3 h-max space-y-4 dark:bg-background dark:border-none dark:shadow-none">
        {cart.toReversed().map((item, index) => (
          <div className="flex flex-col gap-4" key={index}>
            <CartItem item={item} hasSeparator={index !== cart.length - 1} />
          </div>
        ))}
      </Card>
      <div className="min-w-80 max-w-80 h-max flex-grow sticky top-0 -mt-[calc(4rem+1.5rem+1px)] pt-[calc(1.5rem+2rem+2rem+1px)]">
        <CartBreakdown />
      </div>
    </>
  );
}
