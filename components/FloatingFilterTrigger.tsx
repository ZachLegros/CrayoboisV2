"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FaFilter } from "react-icons/fa";
import { Button, type ButtonProps } from "./ui/button";

export default function FloatingFilterTrigger(props: ButtonProps) {
  const { className, ...buttonProps } = props;
  const t = useTranslations("filters");

  return (
    <Button
      size="lg"
      className={cn(
        "m-3 mb-6 text-lg drop-shadow-lg p-4 pointer-events-auto",
        className,
      )}
      {...buttonProps}
    >
      {t("filter")}
      <FaFilter className="ml-1 text-sm" />
    </Button>
  );
}
