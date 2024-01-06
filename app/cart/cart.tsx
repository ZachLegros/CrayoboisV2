"use client";

import CartItem from "./cart-item";
import EmptyCart from "./empty-cart";
import { useCartStore } from "./store";
import CartBreakdown from "./cart-breakdown";
import { Divider } from "@nextui-org/react";

export default function Cart() {
  const { cart } = useCartStore();

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  // const stubProduct = {
  //   product: {
  //     ...cart[0].product,
  //     id: uuidv4(),
  //     image: (cart[0].product as any)?.material.image,
  //     is_custom: false,
  //   },
  //   quantity: 1,
  // } as CartItemType;

  return (
    <>
      <div className="animate-in flex flex-col flex-1">
        {cart.toReversed().map((item, index) => (
          <div className="flex flex-col gap-4 mb-4" key={index}>
            <CartItem item={item} />
            {index !== cart.length - 1 && <Divider />}
          </div>
        ))}
        {/* <CartItem item={stubProduct} /> */}
      </div>
      <div className="w-72 max-h-screen overflow-hidden sticky top-0 -mt-[calc(64px+24px+1px)] pt-[calc(64px+24px+1px)]">
        <CartBreakdown />
      </div>
    </>
  );
}
