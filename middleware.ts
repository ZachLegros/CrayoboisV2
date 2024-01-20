import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";
import { Role } from "@prisma/client";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const { data } = await supabase.auth.getSession();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    try {
      const userId = data?.session?.user.id;
      if (!userId) throw new Error("missing_user_id");
      const userData: { role: Role } = await fetch(
        `${request.nextUrl.origin}/api/user_role?user_id=${userId}`
      ).then((res) => res.json());
      if (userData?.role !== "admin")
        return NextResponse.redirect(new URL("/", request.url));
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (data.session && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!data.session && request.nextUrl.pathname.startsWith("/orders")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
