"use client";

import { useState } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link as NextUILink,
} from "@nextui-org/react";
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
    <Navbar maxWidth="xl" onMenuOpenChange={setIsMenuOpen} isBlurred={false} isBordered>
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
            <NavbarItem key={`${item.title}-${index}`} isActive={isActive}>
              <NextUILink
                as={Link}
                className={`font-medium ${isActive ? "text-gray-100" : "text-gray-400"}`}
                color="foreground"
                href={item.link}
              >
                {item.title}
              </NextUILink>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <AuthButton />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {items.map((item, index) => {
          const isActive = item.link === pathname;
          return (
            <NavbarMenuItem key={`${item}-menu-${index}`}>
              <NextUILink
                as={Link}
                className={
                  isActive
                    ? "transition-colors font-medium"
                    : "text-muted-foreground transition-colors font-medium"
                }
                href={item.link}
              >
                {item.title}
              </NextUILink>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </Navbar>
  );
}
