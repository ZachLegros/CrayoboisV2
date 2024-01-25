"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/user-store";
import { useCartStore } from "@/app/cart/store";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FaUser } from "react-icons/fa";
import { getUserMenuItems } from "@/app/actions";

const defaultItems = [
  {
    label: "Mes commandes",
    href: "/orders",
  },
];

export default function AuthButton() {
  const router = useRouter();
  const { user, signOut, getCurrentUser } = useUserStore();
  const { clearCart } = useCartStore();
  const [items, setItems] = useState(defaultItems);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await signOut();
    clearCart();
    router.push("/");
  };

  useEffect(() => {
    if (!user) getCurrentUser();
  }, [user]);

  useEffect(() => {
    if (user)
      getUserMenuItems().then((items) =>
        setItems((prev) => [...items, ...prev])
      );
    else setItems(defaultItems);
  }, [user]);

  return (
    <div className="flex gap-2">
      {user ? (
        <UserMenu items={items} onLogout={handleLogout} />
      ) : (
        <Button onClick={handleLogin}>Connexion</Button>
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <FaUser />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel>{email?.split("@")[0]}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item, index) => (
          <DropdownMenuItem onClick={() => router.push(item.href)} key={index}>
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={onLogout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
