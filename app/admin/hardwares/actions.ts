"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { Hardware } from "@prisma/client";
import { cookies } from "next/headers";

export async function getHardwares(): Promise<Hardware[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";

  if (isAdmin) {
    return await prisma.hardware.findMany();
  }
  return [];
}

export async function updateHardwareInDb(hardware: Hardware) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";

  if (isAdmin) {
    await prisma.hardware.update({
      where: { id: hardware.id },
      data: { ...hardware },
    });
    return true;
  }
  return false;
}
