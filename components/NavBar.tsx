"use client";

import { useCartStore } from "@/app/cart/store";
import useUserStore from "@/app/user-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { FaBars } from "react-icons/fa";
import AuthButton from "./AuthButton";
import CartButton from "./CartButton";
import Logo from "./Logo";
import { ModeToggle } from "./ModeToggle";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";

const items = [
  {
    title: "Produits",
    link: "/products",
  },
  {
    title: "Commander sur mesure",
    link: "/custom-order",
  },
  {
    title: "Contact",
    link: "/contact",
  },
];

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center sticky top-0 w-full h-16 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="flex justify-between items-center self-center w-full max-w-screen-xl mx-auto px-3 md:px-4 lg:px-6">
        <div className="flex space-x-4 items-center flex-grow justify-between lg:justify-start">
          <Logo className="flex mr-4" />
          <NavLinks items={items} className="hidden lg:flex space-x-4" />
        </div>
        <div className="hidden lg:flex gap-2 items-center">
          <CartButton />
          <ModeToggle />
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
        <div className="flex gap-2 lg:hidden">
          <CartButton />
          <Button size="icon" onClick={() => setIsMenuOpen(true)}>
            <FaBars />
          </Button>
        </div>
      </div>
      <MobileMenu isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
    </header>
  );
}

export function NavLinks(props: {
  items: { title: string; link: string }[];
  className?: string;
  onNavLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const { items, className, onNavLinkClick } = props;
  return (
    <ul className={className}>
      {items.map((item) => {
        return (
          <li key={item.title}>
            <Link
              href={item.link}
              className="transition-colors text-md font-medium text-foreground/70 hover:text-foreground aria-[current]:font-sem aria-[current]:text-foreground"
              aria-current={pathname.startsWith(item.link) ? "page" : undefined}
              onClick={onNavLinkClick}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
export function MobileNavLinks(props: {
  items: { title: string; link: string }[];
  className?: string;
  onNavLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const { items, className, onNavLinkClick } = props;
  const { cart, cartState } = useCartStore();
  const { user, signOut } = useUserStore();

  const linkStyle =
    "transition-colors text-foreground/70 hover:text-foreground aria-[current]:font-sem aria-[current]:text-foreground";

  const handleLogout = async () => {
    await signOut();
    cart.clear();
  };

  return (
    <ul className={cn("text-lg font-medium min-h-max pl-2 lg:pl-0", className)}>
      <li>
        <ModeToggle className="mb-4 -ml-2" />
      </li>
      {items.map((item) => {
        return (
          <li key={item.title}>
            <Link
              href={item.link}
              className={linkStyle}
              aria-current={pathname.startsWith(item.link) ? "page" : undefined}
              onClick={onNavLinkClick}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
      <li className="flex items-center">
        <Link
          href={"/cart"}
          className={linkStyle}
          aria-current={pathname.startsWith("/cart") ? "page" : undefined}
          onClick={onNavLinkClick}
        >
          Mon panier
        </Link>
        {cartState.items.length > 0 && (
          <Badge className="ml-2">{cartState.items.length}</Badge>
        )}
      </li>
      {user ? (
        <>
          <li className="flex items-center">
            <Link
              href={"/orders"}
              className={linkStyle}
              aria-current={pathname.startsWith("/orders") ? "page" : undefined}
              onClick={onNavLinkClick}
            >
              Mes commandes
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              href={"/"}
              className={linkStyle}
              onClick={() => {
                handleLogout();
                onNavLinkClick?.();
              }}
            >
              Déconnexion
            </Link>
          </li>
          {user.user_metadata.role === "admin" && (
            <>
              <span className="w-full border" />
              <li className="text-xl font-semibold">Admin</li>
              <span className="w-full border" />
              <li>
                <Link
                  href={"/admin"}
                  className={linkStyle}
                  aria-current={pathname === "/admin" ? "page" : undefined}
                  onClick={onNavLinkClick}
                >
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link
                  href={"/admin/orders"}
                  className={linkStyle}
                  aria-current={
                    pathname.startsWith("/admin/orders") ? "page" : undefined
                  }
                  onClick={onNavLinkClick}
                >
                  Commandes
                </Link>
              </li>
              <li>
                <Link
                  href={"/admin/materials"}
                  className={linkStyle}
                  aria-current={
                    pathname.startsWith("/admin/materials") ? "page" : undefined
                  }
                  onClick={onNavLinkClick}
                >
                  Matériaux
                </Link>
              </li>
              <li>
                <Link
                  href={"/admin/hardwares"}
                  className={linkStyle}
                  aria-current={
                    pathname.startsWith("/admin/hardwares") ? "page" : undefined
                  }
                  onClick={onNavLinkClick}
                >
                  Matériels
                </Link>
              </li>
              <li>
                <Link
                  href={"/admin/products"}
                  className={linkStyle}
                  aria-current={
                    pathname.startsWith("/admin/products") ? "page" : undefined
                  }
                  onClick={onNavLinkClick}
                >
                  Produits
                </Link>
              </li>
            </>
          )}
        </>
      ) : (
        <li className="flex items-center">
          <Link href={"/login"} className={linkStyle} onClick={onNavLinkClick}>
            Connexion
          </Link>
        </li>
      )}
    </ul>
  );
}

export function MobileMenu(props: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const { isOpen, onOpenChange } = props;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <MobileNavLinks
          items={items}
          className="flex flex-col lg:hidden space-y-2 mt-12"
          onNavLinkClick={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
