"use client";

import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link as NextUILink,
  Button,
} from "@nextui-org/react";
import AuthButton from "./AuthButton";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoLight from "@/images/logo-light.svg";

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
    <Navbar>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NextUILink as={Link} color="foreground" href="/" className="mr-4">
          <LogoLight className="h-[50px]" />
        </NextUILink>
        {items.map((item, index) => {
          const isActive = item.link === pathname;
          return (
            <NavbarItem key={index} isActive={isActive}>
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
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <AuthButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
