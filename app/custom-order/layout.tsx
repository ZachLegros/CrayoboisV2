import { ReactNode } from "react";
import MaterialFilterPanel from "./material-filter-panel";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <div className="w-full">
      <div className="flex w-full gap-4">
        <div className="w-72 h-screen overflow-hidden sticky top-0 -mt-[calc(64px+24px+1px)] pt-[calc(64px+24px+1px)]">
          <MaterialFilterPanel />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
