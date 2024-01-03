"use client";

import { ReactNode } from "react";

export default function ItemsGrid(props: { children: ReactNode[] }) {
  const { children } = props;
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{children}</div>;
}
