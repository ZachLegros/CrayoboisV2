"use client";

import { useCartStore } from "@/app/[locale]/cart/store";
import useUserStore from "@/app/user-store";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import { FaBars } from "react-icons/fa";
import AuthButton from "./AuthButton";
import CartButton from "./CartButton";
import { LanguageToggle } from "./LanguageToggle";
import Logo from "./Logo";
import { ModeToggle } from "./ModeToggle";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("nav");

  const items = [
    {
      title: t("products"),
      link: "/products",
    },
    {
      title: t("customOrder"),
      link: "/custom-order",
    },
    {
      title: t("contact"),
      link: "/contact",
    },
  ];

  return (
    <header className="flex items-center sticky top-0 w-full h-16 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="flex justify-between items-center self-center w-full max-w-screen-xl mx-auto px-3 md:px-4 lg:px-6">
        <div className="flex space-x-4 items-center flex-grow justify-between lg:justify-start">
          <Logo className="flex mr-4" />
          <NavLinks items={items} className="hidden lg:flex space-x-4" />
        </div>
        <div className="hidden lg:flex gap-2 items-center">
          <CartButton />
          <LanguageToggle />
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
  const t = useTranslations("nav");

  const linkStyle =
    "transition-colors text-foreground/70 hover:text-foreground aria-[current]:font-sem aria-[current]:text-foreground";

  const handleLogout = async () => {
    await signOut();
    cart.clear();
  };

  return (
    <ul className={cn("text-lg font-medium min-h-max pl-2 lg:pl-0", className)}>
      <li className="flex gap-2 mb-4 -ml-2">
        <LanguageToggle />
        <ModeToggle />
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
          {t("myCart")}
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
              {t("myOrders")}
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
              {t("logout")}
            </Link>
          </li>
          {user.user_metadata.role === "admin" && (
            <>
              <span className="w-full border" />
              <li className="text-xl font-semibold">{t("admin")}</li>
              <span className="w-full border" />
              <li>
                <Link
                  href={"/admin"}
                  className={linkStyle}
                  aria-current={pathname === "/admin" ? "page" : undefined}
                  onClick={onNavLinkClick}
                >
                  {t("dashboard")}
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
                  {t("orders")}
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
                  {t("materials")}
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
                  {t("hardwares")}
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
                  {t("adminProducts")}
                </Link>
              </li>
            </>
          )}
        </>
      ) : (
        <li className="flex items-center">
          <Link href={"/login"} className={linkStyle} onClick={onNavLinkClick}>
            {t("login")}
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
  const t = useTranslations("nav");

  const items = [
    {
      title: t("products"),
      link: "/products",
    },
    {
      title: t("customOrder"),
      link: "/custom-order",
    },
    {
      title: t("contact"),
      link: "/contact",
    },
  ];

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
