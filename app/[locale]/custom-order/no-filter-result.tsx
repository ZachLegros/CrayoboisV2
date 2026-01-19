import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useCustomOrderStore } from "./store";

export default function NoFilterResult() {
  const { clearFilters } = useCustomOrderStore();
  const t = useTranslations("customOrder");

  return (
    <div className="flex flex-col items-center justify-start w-full h-full mt-11">
      <div className="flex flex-col">
        <p className="text-2xl lg:text-3xl font-bold text-center">
          {t("noFilterResult")}
        </p>
        <div className="flex mt-8 gap-4 justify-center items-center flex-wrap">
          <Button onClick={() => clearFilters()}>{t("resetFilters")}</Button>
        </div>
      </div>
    </div>
  );
}
