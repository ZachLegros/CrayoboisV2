"use client";

import { useRouter } from "next/navigation";
import { Badge, Button } from "@nextui-org/react";
import { FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "@/app/cart/store";

export default function Cart() {
  const router = useRouter();
  const { cart } = useCartStore();

  return (
    <Button
      isIconOnly
      className="flex items-center justify-center"
      variant="light"
      aria-label="cart"
      onClick={() => router.push("/cart")}
    >
      <Badge
        content={cart.length}
        color="primary"
        size="sm"
        isInvisible={cart.length < 1}
        showOutline={false}
      >
        <FaShoppingCart className="text-2xl" />
      </Badge>
    </Button>
  );
}
