"use client";

import type { ReactNode } from "react";
import ProductHeader from "./product-header";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div className="flex flex-col gap-3 p-3 border rounded-xl">
      <ProductHeader />
      {children}
    </div>
  );
}
