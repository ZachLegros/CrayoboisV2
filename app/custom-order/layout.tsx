import type { ReactNode } from "react";
import SidePanel from "./side-panel";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-auto">
      <SidePanel className="hidden md:flex col-span-1 md:col-span-4 lg:col-span-3" />
      <div className="flex flex-col col-span-1 md:col-span-8 lg:col-span-9 gap-4 flex-auto">
        {children}
      </div>
    </div>
  );
}
