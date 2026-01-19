"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";

export default function ProductHeader() {
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => router.push("/admin/products")}>
        <FaChevronLeft className="mr-1" />
        Produits
      </Button>
    </div>
  );
}
