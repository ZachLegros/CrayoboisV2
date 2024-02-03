export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { FaPlus } from "react-icons/fa";
import CreateHardware from "./create-hardware";
import HardwaresTable from "./hardwares-table";

export default async function AdminMaterials() {
  const hardwares = await prisma.hardware.findMany();

  return (
    <div className="flex flex-col flex-auto max-w-full gap-3">
      <CreateHardware>
        <Button className="ml-auto">
          Ajouter du matériel
          <FaPlus className="ml-1" />
        </Button>
      </CreateHardware>
      <div className="flex-auto h-0 overflow-auto">
        <HardwaresTable hardwares={hardwares} />
      </div>
    </div>
  );
}
