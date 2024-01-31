export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import MaterialsTable from "./materials-table";

export default async function AdminMaterials() {
  const materials = await prisma.material.findMany();

  return (
    <div className="md:p-3 md:border rounded-xl">
      <MaterialsTable materials={materials} />
    </div>
  );
}
