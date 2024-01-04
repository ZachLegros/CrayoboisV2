import { ReactNode } from "react";
import SidePanel from "./side-panel";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <div className="w-full">
      <div className="flex w-full gap-4">
        <SidePanel />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
