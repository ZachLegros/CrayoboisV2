"use client";

import { useCartStore } from "@/app/[locale]/cart/store";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FaShoppingCart } from "react-icons/fa";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default function Cart() {
  const router = useRouter();
  const { cartState } = useCartStore();
  const t = useTranslations("nav");

  return (
    <Button
      className="flex items-center justify-center p-2"
      variant="outline"
      aria-label="cart"
      onClick={() => router.push("/cart")}
    >
      <p className="hidden sm:flex sm:mr-1">{t("myCart")}</p>
      <div className="relative">
        <FaShoppingCart className="text-xl" />
        {cartState.items.length > 0 && (
          <Badge className="flex justify-center items-center absolute top-0 right-0 -mt-1.5 -mr-1.5 rounded-full p-0 text-2xs w-3.5 h-3.5">
            {cartState.items.length}
          </Badge>
        )}
      </div>
    </Button>
  );
}
