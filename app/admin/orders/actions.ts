"use server";

import { createClient } from "@/lib/supabase/server";
import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function setOrderStatusInDb(
  orderId: string,
  orderStatus: OrderStatus
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";
  if (isAdmin) {
    await prisma.clientOrder.update({
      where: { id: orderId },
      data: { status: orderStatus },
    });
    return true;
  }
  return false;
}