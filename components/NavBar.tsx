"use client";

import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AuthButton from "./AuthButton";
import Logo from "./Logo";
import { ModeToggle } from "./ModeToggle";
import Cart from "./Cart";
import { Sheet, SheetContent } from "./ui/sheet";
import { Button } from "./ui/button";
import { FaBars } from "react-icons/fa";

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

export function NavLinks(props: {
  items: { title: string; link: string }[];
  className?: string;
  onNavLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const { items, className, onNavLinkClick } = props;
  return (
    <ul className={className}>
      {items.map((item, index) => {
        return (
          <li key={index}>
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
      <li className="flex items-center lg:hidden">
        <Link
          href={"/cart"}
          className="transition-colors text-md font-medium text-foreground/70 hover:text-foreground aria-[current]:font-semibold aria-[current]:text-foreground"
          aria-current={pathname.startsWith("/cart") ? "page" : undefined}
          onClick={onNavLinkClick}
        >
          Mon panier
        </Link>
      </li>
    </ul>
  );
}

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center sticky top-0 w-full h-16 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex justify-between items-center self-center w-full max-w-screen-xl mx-auto px-6">
        <div className="flex space-x-4 items-center flex-grow justify-between lg:justify-start">
          <Logo className="flex mr-4" />
          <NavLinks items={items} className="hidden lg:flex space-x-4" />
          <Button
            size="icon"
            className="flex lg:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <FaBars />
          </Button>
        </div>
        <div className="hidden lg:flex gap-2 items-center">
          <ModeToggle />
          <Cart />
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </div>
      <MobileMenu isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
    </header>
  );
}

export function MobileMenu(props: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const { isOpen, onOpenChange } = props;
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <NavLinks
          items={items}
          className="flex flex-col lg:hidden space-y-2 mt-12"
          onNavLinkClick={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
