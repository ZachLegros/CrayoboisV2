"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Button onClick={() => router.push("/admin/orders")}>
          <FaChevronLeft className="mr-1" />
          Commandes
        </Button>
      </div>
      {children}
    </div>
  );
}
