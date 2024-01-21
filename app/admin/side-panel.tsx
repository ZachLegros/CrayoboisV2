"use client";

import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

const routes = [
  { name: "Tableau de bord", href: "/admin" },
  { name: "Commandes", href: "/admin/orders" },
  { name: "Matériaux", href: "/admin/materials" },
  { name: "Matériels", href: "/admin/hardwares" },
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
            className="p-2 hover:bg-secondary rounded-md cursor-pointer aria-[current]:bg-secondary"
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
