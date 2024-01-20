"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/user-store";
import { useCartStore } from "@/app/cart/store";
import { Button } from "./ui/button";
import { useEffect } from "react";
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
        <UserMenu onLogout={handleLogout} />
      ) : (
        <Button onClick={handleLogin}>Connexion</Button>
      )}
    </div>
  );
}

export function UserMenu(props: { onLogout: () => void }) {
  const { onLogout } = props;
  const { email, role } = useUserStore();
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
        {role === "admin" && (
          <DropdownMenuItem onClick={() => router.push("/admin")}>
            Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => router.push("/orders")}>
          Mes commandes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
