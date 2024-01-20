import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function OrdersPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.auth.getUser();

  const orders = await prisma.clientOrder.findMany({
    where: {
      OR: [{ user_id: data.user?.id }, { payer_email: data.user?.email }],
    },
    include: {
      products: true,
      custom_products: true,
    },
  });

  return <pre>{JSON.stringify(orders, null, 2)}</pre>;
}
