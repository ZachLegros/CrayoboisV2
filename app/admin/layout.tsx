import type { ReactNode } from "react";
import SidePanel from "./side-panel";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <div className="flex-auto bg-background grid shadow-lg md:border rounded-xl grid-cols-1 md:grid-cols-admin-panel">
      <SidePanel className="hidden md:flex" />
      <div className="flex md:border-l md:p-3 flex-auto">{children}</div>
    </div>
  );
}
