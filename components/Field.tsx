import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function Field(props: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const { label, children, className } = props;
  return (
    <div className={cn("flex items-center gap-2 h-9", className)}>
      <p className="font-semibold">{label}:</p>
      {children}
    </div>
  );
}
