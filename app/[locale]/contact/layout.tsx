import type { ReactNode } from "react";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div className="flex flex-col justify-center items-center flex-auto">
      {children}
    </div>
  );
}
