"use client";

import type { ReactNode } from "react";
import HardwareHeader from "./hardware-header";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div className="flex flex-col gap-3 p-3 border rounded-xl">
      <HardwareHeader />
      {children}
    </div>
  );
}
