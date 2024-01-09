"use client";

import { Suspense, useState } from "react";
import { Navbar, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuToggle } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AuthButton from "./AuthButton";
import Logo from "./Logo";

export default function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <Navbar
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
      isBlurred={false}
      isBordered
      classNames={{
        wrapper: "bg-background",
        menu: "bg-background",
      }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarContent className="sm:hidden" justify="center">
        <Logo className="mr-4" />
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
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
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Suspense>
            <AuthButton />
          </Suspense>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {items.map((item, index) => {
          return (
            <Link
              key={index}
              href={item.link}
              className={
                item.link === pathname
                  ? "text-md font-medium transition-colors hover:text-foreground"
                  : "text-md font-sem text-foreground/70 transition-colors hover:text-foreground"
              }
            >
              {item.title}
            </Link>
          );
        })}
      </NavbarMenu>
    </Navbar>
  );
}
