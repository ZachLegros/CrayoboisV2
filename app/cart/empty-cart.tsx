"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EmptyCart() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-max justify-center">
      <p className="text-center text-2xl font-semibold lg:text-left">
        Votre panier est vide.
      </p>
      <div className="flex flex-wrap gap-2 items-center justify-center mt-5">
        <Button onClick={() => router.push("/custom-order")}>
          Commander sur mesure
        </Button>
        <Button onClick={() => router.push("/products")}>Voir les produits</Button>
      </div>
    </div>
  );
}
