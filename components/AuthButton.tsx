"use client";

import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { useUser } from "@/app/user-provider";

export default function AuthButton() {
  const router = useRouter();
  const { user, signOut } = useUser();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return user ? (
    <div className="flex items-center gap-4">
      {/* {user.email} */}
      <Button onClick={handleLogout} disableAnimation disableRipple>
        Déconnexion
      </Button>
    </div>
  ) : (
    <Button onClick={handleLogin} disableAnimation disableRipple>
      Connexion
    </Button>
  );
}
