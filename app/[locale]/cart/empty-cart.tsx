"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function EmptyCart() {
  const router = useRouter();
  const t = useTranslations("cart");

  return (
    <div className="flex flex-col w-max justify-center">
      <p className="text-center text-2xl font-semibold lg:text-left">{t("empty")}</p>
      <div className="flex flex-wrap gap-2 items-center justify-center mt-5">
        <Button onClick={() => router.push("/custom-order")}>
          {t("orderCustom")}
        </Button>
        <Button onClick={() => router.push("/products")}>{t("viewProducts")}</Button>
      </div>
    </div>
  );
}
