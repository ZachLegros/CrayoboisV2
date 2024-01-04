"use client";

import CartItem from "./cart-item";
import EmptyCart from "./empty-cart";
import { useCartStore } from "./store";
import CartBreakdown from "./cart-breakdown";

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
      <div className="flex flex-col flex-1 gap-4">
        {cart.map((item, index) => (
          <>
            <CartItem item={item} />
            {index !== cart.length - 1 && <div className="border-b" />}
          </>
        ))}
        {/* <CartItem item={stubProduct} /> */}
      </div>
      <div className="w-72">
        <CartBreakdown />
      </div>
    </>
  );
}
