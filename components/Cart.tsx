"use client";

import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";
// import { useCartStore } from "@/app/cart/store";
import { Button } from "./ui/button";

export default function Cart() {
  const router = useRouter();
  // const { cart } = useCartStore();

  return (
    <Button
      className="flex items-center justify-center"
      variant="outline"
      size="icon"
      aria-label="cart"
      onClick={() => router.push("/cart")}
    >
      <FaShoppingCart className="text-2xl" />
      {/* <Badge
        content={cart.length}
        color="primary"
        size="sm"
        isInvisible={cart.length < 1}
        showOutline={false}
      >
      </Badge> */}
    </Button>
  );
}
