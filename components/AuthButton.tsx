"use client";

import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { useUserStore } from "@/app/user-store";
import { useCartStore } from "@/app/cart/store";
import Cart from "./Cart";

export default function AuthButton() {
  const router = useRouter();
  const { user, signOut } = useUserStore();
  const { clearCart } = useCartStore();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await signOut();
    clearCart();
    router.push("/");
  };

  return (
    <div className="flex gap-2">
      {user ? (
        <div className="flex items-center gap-4">
          {/* {user.email} */}
          <Button onClick={handleLogout}>Déconnexion</Button>
        </div>
      ) : (
        <Button onClick={handleLogin}>Connexion</Button>
      )}
      <Cart />
    </div>
  );
}
