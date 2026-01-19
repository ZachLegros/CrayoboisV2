export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { FaPlus } from "react-icons/fa";
import CreateMaterial from "./create-material";
import MaterialsTable from "./materials-table";

export default async function AdminMaterials() {
  const materials = await prisma.material.findMany();

  return (
    <div className="flex flex-col flex-auto max-w-full gap-3">
      <CreateMaterial>
        <Button className="ml-auto">
          Ajouter un matériau
          <FaPlus className="ml-1" />
        </Button>
      </CreateMaterial>
      <div className="flex-auto h-0 overflow-auto">
        <MaterialsTable materials={materials} />
      </div>
    </div>
  );
}
