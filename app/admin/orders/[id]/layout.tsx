"use client";

import type { ReactNode } from "react";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;
  return <div className="flex flex-col flex-auto gap-3">{children}</div>;
}
