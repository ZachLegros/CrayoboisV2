import { prisma } from "@/utils/prisma";

export default async function CustomOrder() {
  const materials = await prisma.material.findMany();

  return <div className="w-full">{JSON.stringify(materials, null, 2)}</div>;
}
