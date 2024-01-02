"use client";

import { NextUIProvider } from "@nextui-org/react";
import UserProvider from "./user-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <UserProvider>{children}</UserProvider>
    </NextUIProvider>
  );
}
