"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <NextTopLoader color="#cc5500" showSpinner={false} />
      {children}
    </NextThemesProvider>
  );
}
