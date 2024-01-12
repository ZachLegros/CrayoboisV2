import { ReactNode } from "react";
import SidePanel from "./side-panel";
import FloatingFilterTrigger from "@/components/FloatingFilterTrigger";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <div className="flex w-full gap-4">
      <SidePanel className="hidden md:flex" />
      <FloatingFilterTrigger className="flex md:hidden" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
