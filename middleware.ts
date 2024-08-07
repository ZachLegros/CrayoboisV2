// import { createClient } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // const { supabase, response } = createClient(request);

  // const { data } = await supabase.auth.getSession();

  // if (request.nextUrl.pathname.startsWith("/admin")) {
  //   try {
  //     const role = data.session?.user.user_metadata.role;
  //     if (role !== "admin") return NextResponse.redirect(new URL("/", request.url));
  //   } catch {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }

  // if (data.session && request.nextUrl.pathname.startsWith("/login")) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // if (!data.session && request.nextUrl.pathname.startsWith("/orders")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  if (request.nextUrl.pathname !== "/")
    return NextResponse.redirect(new URL("/", request.url));
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
