"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";

export default function HardwareHeader() {
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => router.push("/admin/hardwares")}>
        <FaChevronLeft className="mr-1" />
        Matériels
      </Button>
    </div>
  );
}
