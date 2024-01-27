"use client";

import { getUserMenuItems } from "@/app/actions";
import { useCartStore } from "@/app/cart/store";
import { useUserStore } from "@/app/user-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Button } from "./ui/button";

const defaultItems = [
  {
    label: "Mes commandes",
    href: "/orders",
  },
];

export default function AuthButton() {
  const router = useRouter();
  const { user, signOut, getCurrentUser } = useUserStore();
  const { cart } = useCartStore();
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
    if (user)
      getUserMenuItems().then((items) => setItems((prev) => [...items, ...prev]));
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
        {items.map((item) => (
          <DropdownMenuItem onClick={() => router.push(item.href)} key={item.label}>
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={onLogout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
