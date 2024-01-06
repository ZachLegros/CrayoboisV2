"use client";

import { NextUIProvider } from "@nextui-org/react";
import UserProvider from "./user-provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <UserProvider>{children}</UserProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
