import type { ReactNode } from "react";
import SidePanel from "./side-panel";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <div className="flex-auto bg-background grid shadow-lg md:p-3 md:border rounded-xl grid-cols-1 md:grid-cols-admin-panel gap-8">
      <SidePanel className="hidden md:flex" />
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
