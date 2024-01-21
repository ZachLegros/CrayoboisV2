"use server";
import { headers, cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { User } from "@supabase/supabase-js";

export const sendOtp = async (email: string) => {
  "use server";

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${headers().get("origin")}/login`,
    },
  });
};

export const verifyOtp = async (email: string, code: string) => {
  "use server";

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const res = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });
  if (res.data.user) createProfileIfNotExists(res.data.user);

  return res;
};

export const createProfileIfNotExists = async (user: User) => {
  "use server";

  console.log(user);
  if (!user.email) return false;

  await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email,
    },
  });

  return true;
};
