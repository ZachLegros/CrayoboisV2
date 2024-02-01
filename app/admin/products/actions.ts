"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@prisma/client";
import { cookies } from "next/headers";

export async function getProducts(): Promise<Product[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";

  if (isAdmin) {
    return await prisma.product.findMany();
  }
  return [];
}

export async function updateProductInDb(product: Product) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";

  if (isAdmin) {
    await prisma.product.update({
      where: { id: product.id },
      data: { ...product },
    });
    return true;
  }
  return false;
}
