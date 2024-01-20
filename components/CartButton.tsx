"use client";

import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "@/app/cart/store";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function Cart() {
  const router = useRouter();
  const { cart } = useCartStore();

  return (
    <Button
      className="flex items-center justify-center p-2"
      variant="outline"
      aria-label="cart"
      onClick={() => router.push("/cart")}
    >
      <p className="hidden sm:flex sm:mr-1">Mon panier</p>
      <div className="relative">
        <FaShoppingCart className="text-xl" />
        {cart.length > 0 && (
          <Badge className="flex justify-center items-center absolute top-0 right-0 -mt-1.5 -mr-1.5 rounded-full p-0 text-2xs w-3.5 h-3.5">
            {cart.length}
          </Badge>
        )}
      </div>
    </Button>
  );
}
