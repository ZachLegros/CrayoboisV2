import { ReactNode } from "react";
import SidePanel from "./side-panel";
import FloatingFilterTrigger from "@/components/FloatingFilterTrigger";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <SidePanel className="hidden md:flex col-span-1 md:col-span-4 lg:col-span-3" />
      <div className="flex flex-col col-span-1 md:col-span-8 lg:col-span-9 gap-4 h-[calc(100vh - 4rem - 1.5rem - 1px)]">
        {children}
      </div>
      <FloatingFilterTrigger className="flex md:hidden" />
    </div>
  );
}
