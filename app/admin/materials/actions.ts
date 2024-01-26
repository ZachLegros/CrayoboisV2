"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { Material } from "@prisma/client";

export async function getMaterials() {
  const materials = await prisma.material.findMany();
  return materials;
}

export async function updateMaterialInDb(material: Material) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";

  if (isAdmin) {
    await prisma.material.update({
      where: { id: material.id },
      data: { ...material },
    });
    return true;
  }
  return false;
}
