"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { shuffleArray } from "@/lib/utils";
import { cookies } from "next/headers";

export async function getProductImages(amount: number): Promise<string[]> {
  const data = await prisma.product.findMany({ select: { image: true } });
  if (data.length === 0) return [];
  return shuffleArray(data.map((product) => product.image)).slice(0, amount);
}

export async function getUserMenuItems(): Promise<
  { label: string; href: string }[]
> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user?.user_metadata.role === "admin";

  if (isAdmin) return [{ label: "Admin", href: "/admin" }];
  return [];
}
