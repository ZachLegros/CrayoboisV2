import { createClient } from "@/lib/supabase/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // files with extensions
  ) {
    return NextResponse.next();
  }

  // Apply i18n middleware first to get locale-prefixed response
  const intlResponse = intlMiddleware(request);

  // Extract locale from pathname or use default
  const localeMatch = pathname.match(/^\/(fr|en)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Get the path without locale prefix
  const pathWithoutLocale = pathname.replace(/^\/(fr|en)/, "") || "/";

  // Create Supabase client
  const { supabase } = createClient(request);
  const { data } = await supabase.auth.getSession();

  // Check admin routes (with locale prefix)
  if (pathWithoutLocale.startsWith("/admin")) {
    try {
      const role = data.session?.user.user_metadata.role;
      if (role !== "admin") {
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
      }
    } catch {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  // Redirect logged-in users away from login page
  if (data.session && pathWithoutLocale.startsWith("/login")) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Redirect non-logged-in users away from orders page
  if (!data.session && pathWithoutLocale.startsWith("/orders")) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * - files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)",
  ],
};
