"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <NextUIProvider>
        <NextTopLoader color="#cc5500" showSpinner={false} />
        {children}
      </NextUIProvider>
    </NextThemesProvider>
  );
}
