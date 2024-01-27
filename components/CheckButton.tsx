"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

export default function CheckButton(props: {
  isChecked: boolean;
  onClick: () => void;
  children: React.ReactNode;
  isDisabled?: boolean;
  className?: string;
}) {
  const { isChecked, onClick, children, className, isDisabled } = props;

  return (
    <Button
      className={cn("flex justify-between p-3 text-lg font-semibold", className)}
      variant="ghost"
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
      <Checkbox checked={isChecked} className="pointer-events-none m-0! p-0" />
    </Button>
  );
}
