export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import HardwaresTable from "./hardwares-table";

export default async function AdminMaterials() {
  const hardwares = await prisma.hardware.findMany();

  return (
    <div className="md:p-3 md:border rounded-xl">
      <HardwaresTable hardwares={hardwares} />
    </div>
  );
}
