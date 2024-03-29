import { cn } from "@/lib/utils";
import { FaFilter } from "react-icons/fa";
import { Button, type ButtonProps } from "./ui/button";

export default function FloatingFilterTrigger(props: ButtonProps) {
  const { className, ...buttonProps } = props;

  return (
    <Button
      size="lg"
      className={cn(
        "m-3 mb-6 text-lg drop-shadow-lg p-4 pointer-events-auto",
        className,
      )}
      {...buttonProps}
    >
      Filtrer
      <FaFilter className="ml-1 text-sm" />
    </Button>
  );
}
