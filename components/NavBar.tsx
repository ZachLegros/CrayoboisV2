"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AuthButton from "./AuthButton";
import Logo from "./Logo";
import { ModeToggle } from "./ModeToggle";
import Cart from "./Cart";

export const NAVBAR_HEIGHT = 70;

export default function NavBar() {
  const pathname = usePathname();

  const items = [
    {
      title: "Produits",
      link: "/products",
    },
    {
      title: "Commande sur mesure",
      link: "/custom-order",
    },
    {
      title: "Contact",
      link: "/contact",
    },
  ];

  return (
    <header className="flex items-center sticky top-0 w-full h-16 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex justify-between items-center self-center w-full max-w-screen-xl mx-auto px-6">
        <div className="flex gap-4 items-center">
          <Logo className="hidden sm:flex mr-4" />
          {items.map((item, index) => {
            const isActive = item.link === pathname;
            return (
              <Link
                key={index}
                href={item.link}
                className={
                  isActive
                    ? "text-md font-medium transition-colors hover:text-foreground"
                    : "text-md font-sem text-foreground/70 transition-colors hover:text-foreground"
                }
              >
                {item.title}
              </Link>
            );
          })}
        </div>
        <div className="flex gap-2 items-center">
          <ModeToggle />
          <Cart />
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
