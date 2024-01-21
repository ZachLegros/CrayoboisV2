"use client";

import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

const routes = [
  { name: "Tableau de bord", href: "/admin" },
  { name: "Commandes", href: "/admin/orders" },
  { name: "Matériaux", href: "/admin/materials" },
  { name: "Matériels", href: "/admin/hardwares" },
  { name: "Produits", href: "/admin/products" },
];

export default function SidePanel(props: { className?: string }) {
  const { className } = props;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "h-max sticky top-0 -mt-[calc(4rem+1.5rem+1px)] pt-[calc(4rem+1.5rem+1px)]",
        className
      )}
    >
      <ul className="flex flex-col w-full gap-1">
        {routes.map((route, index) => (
          <li
            key={index}
            className="transition-colors p-2 font-medium hover:bg-background hover:shadow-md dark:hover:bg-secondary rounded-md cursor-pointer aria-[current]:bg-background aria-[current]:shadow-md aria-[current]:font-semibold dark:aria-[current]:bg-secondary"
            onClick={() => router.push(route.href)}
            aria-current={pathname.startsWith(route.href) ? "page" : undefined}
          >
            {route.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
