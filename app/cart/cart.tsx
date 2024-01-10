"use client";

import CartItem from "./cart-item";
import EmptyCart from "./empty-cart";
import { useCartStore } from "./store";
import CartBreakdown from "./cart-breakdown";
import { useEffect } from "react";

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
      <div className="animate-in flex flex-col flex-1">
        {cart.toReversed().map((item, index) => (
          <div className="flex flex-col gap-4 mb-4" key={index}>
            <CartItem item={item} hasSeparator={index !== cart.length - 1} />
          </div>
        ))}
      </div>
      <div className="w-72 max-h-screen overflow-hidden sticky top-0 -mt-[calc(64px+24px+1px)] pt-[calc(64px+24px+1px)]">
        <CartBreakdown />
      </div>
    </>
  );
}
