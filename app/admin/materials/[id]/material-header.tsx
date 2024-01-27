"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";

export default function MaterialHeader() {
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => router.push("/admin/materials")}>
        <FaChevronLeft className="mr-1" />
        Matériaux
      </Button>
    </div>
  );
}
