import { ReactNode } from "react";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <div className="w-full">
      <div className="w-full flex gap-2">
        <div className="w-72"></div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
