"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

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
    <div className={cn("p-3", className)}>
      <ul className="flex flex-col w-full gap-1">
        {routes.map((route) => (
          <li
            key={route.name}
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
