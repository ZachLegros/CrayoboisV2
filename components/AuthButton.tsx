"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/user-store";
import { useCartStore } from "@/app/cart/store";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FaUser } from "react-icons/fa";

export default function AuthButton() {
  const router = useRouter();
  const { user, signOut, getCurrentUser } = useUserStore();
  const { clearCart } = useCartStore();

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

  return (
    <div className="flex gap-2">
      {user ? (
        <UserMenu user={user} onLogout={handleLogout} />
      ) : (
        <Button onClick={handleLogin}>Connexion</Button>
      )}
    </div>
  );
}

export function UserMenu(props: { user: User; onLogout: () => void }) {
  const { user, onLogout } = props;
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <FaUser />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel>{user.email?.split("@")[0]}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/orders")}>
          Mes commandes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
