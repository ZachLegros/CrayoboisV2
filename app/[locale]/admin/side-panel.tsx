"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function SidePanel(props: { className?: string }) {
  const { className } = props;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("admin");

  const routes = [
    { name: t("dashboard"), href: "/admin" },
    { name: t("orders"), href: "/admin/orders" },
    { name: t("materials"), href: "/admin/materials" },
    { name: t("hardwares"), href: "/admin/hardwares" },
    { name: t("products"), href: "/admin/products" },
  ];

  return (
    <div className={cn("p-3", className)}>
      <ul className="flex flex-col w-full gap-1">
        {routes.map((route) => (
          <li
            key={route.href}
            className="transition-colors p-2 font-medium hover:bg-secondary rounded-md cursor-pointer aria-[current]:font-semibold aria-[current]:bg-slate-100 dark:aria-[current]:bg-secondary"
            onClick={() => router.push(route.href)}
            aria-current={pathname === route.href ? "page" : undefined}
          >
            {route.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
