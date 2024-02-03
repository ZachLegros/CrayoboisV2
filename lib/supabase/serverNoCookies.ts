import { createServerClient } from "@supabase/ssr";

export const createNoCookiesClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {},
    },
  );
};
