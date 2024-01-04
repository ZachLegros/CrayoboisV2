import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Orders() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.auth.getUser();

  const orders = await prisma.clientOrder.findMany({
    where: {
      user_id: data.user?.id,
    },
    include: {
      products: {
        include: {
          hardware: true,
          material: true,
        },
      },
    },
  });

  return <pre>{JSON.stringify(orders, null, 2)}</pre>;
}
