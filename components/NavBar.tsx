"use client";

import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import AuthButton from "./AuthButton";
import { usePathname } from "next/navigation";

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
        <Link color="foreground" href="/">
          <p className="font-bold text-inherit">CRAYOBOIS</p>
        </Link>
        {items.map((item, index) => {
          const isActive = item.link === pathname;
          return (
            <NavbarItem key={index} isActive={isActive}>
              <Link
                className={
                  isActive
                    ? "font-semibold transition-colors"
                    : "font-medium text-muted-foreground  transition-colors"
                }
                href={item.link}
              >
                {item.title}
              </Link>
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
