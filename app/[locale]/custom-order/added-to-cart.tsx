import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useCustomOrderStore } from "./store";

export default function AddedToCart() {
  const router = useRouter();
  const { reset } = useCustomOrderStore();
  const t = useTranslations("customOrder");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="mt-11">
      <div className="flex flex-col">
        <p className="text-2xl lg:text-3xl font-bold text-center">
          {t("productAdded")}
        </p>
        <div className="flex mt-8 gap-4 justify-center items-center flex-wrap">
          <Button variant="outline" onClick={() => reset()}>
            {t("createAnother")}
          </Button>
          <Button
            variant="default"
            onClick={() => {
              router.push("/cart");
              reset();
            }}
          >
            {t("goToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
