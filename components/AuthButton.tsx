"use client";

import { useCartStore } from "@/app/[locale]/cart/store";
import { useUserStore } from "@/app/user-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Button } from "./ui/button";

export default function AuthButton() {
  const router = useRouter();
  const { user, signOut, getCurrentUser } = useUserStore();
  const { cart } = useCartStore();
  const t = useTranslations("nav");

  const defaultItems = [
    {
      label: t("myOrders"),
      href: "/orders",
    },
  ];

  const adminItems = [
    {
      label: t("admin"),
      href: "/admin",
    },
  ];

  const [items, setItems] = useState(defaultItems);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await signOut();
    cart.clear();
    router.push("/");
  };

  useEffect(() => {
    if (!user) getCurrentUser();
  }, [user, getCurrentUser]);

  useEffect(() => {
    if (user && user.user_metadata.role === "admin")
      setItems([...adminItems, ...defaultItems]);
    else setItems(defaultItems);
  }, [user, t]);

  return (
    <div className="flex gap-2">
      {user ? (
        <UserMenu items={items} onLogout={handleLogout} />
      ) : (
        <Button onClick={handleLogin}>{t("login")}</Button>
      )}
    </div>
  );
}

export function UserMenu(props: {
  items: { label: string; href: string }[];
  onLogout: () => void;
}) {
  const { items, onLogout } = props;
  const { email } = useUserStore();
  const router = useRouter();
  const t = useTranslations("nav");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <FaUser />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel>{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem onClick={() => router.push(item.href)} key={item.label}>
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={onLogout}>{t("logout")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
