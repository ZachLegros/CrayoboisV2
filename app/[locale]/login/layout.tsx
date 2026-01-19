import type { ReactNode } from "react";

export default function Layout(props: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center flex-auto">
      {props.children}
    </div>
  );
}
