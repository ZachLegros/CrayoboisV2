import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function ItemsGrid(props: {
  children: ReactNode;
  className?: string;
}) {
  const { children, className } = props;
  return (
    <div
      className={cn("animate-in grid grid-cols-1 lg:grid-cols-2 gap-4", className)}
    >
      {children}
    </div>
  );
}
