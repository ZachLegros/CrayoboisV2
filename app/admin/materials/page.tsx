import prisma from "@/lib/prisma";
import MaterialsTable from "./materials-table";

export default async function AdminMaterials() {
  const materials = await prisma.material.findMany();

  return (
    <div className="p-3 border rounded-xl">
      <MaterialsTable materials={materials} />
    </div>
  );
}
