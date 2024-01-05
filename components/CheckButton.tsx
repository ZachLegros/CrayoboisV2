"use client";

import { Button, Checkbox } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";

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
      className={twMerge("flex justify-between p-2 ", className)}
      size="md"
      radius="sm"
      variant="light"
      onClick={onClick}
      isDisabled={isDisabled}
    >
      {children}
      <Checkbox
        isSelected={isChecked}
        isIndeterminate={isChecked}
        className="pointer-events-none m-0! p-0"
      />
    </Button>
  );
}
