"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Material } from "@prisma/client";
import { cookies } from "next/headers";

export async function getMaterials(): Promise<Material[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";

  if (isAdmin) {
    return await prisma.material.findMany();
  }
  return [];
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
