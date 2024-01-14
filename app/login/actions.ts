"use server";
import { headers, cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

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

  return await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });
};
