"use client";

import { cn } from "@/lib/utils";
import { Portal } from "@radix-ui/react-portal";
import { type ReactNode } from "react";

export default function FloatingBar(props: {
  children: ReactNode;
  className?: string;
}) {
  const { className, children } = props;

  return (
    <Portal>
      <div
        className={cn(
          "flex w-full items-end fixed bottom-0 left-0 z-50 h-32 bg-gradient-to-t from-background pointer-events-none",
          className,
        )}
      >
        {children}
      </div>
    </Portal>
  );
}
