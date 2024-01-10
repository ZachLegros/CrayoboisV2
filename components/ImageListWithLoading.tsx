import { ReactNode, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

export default function ImageListWithLoading(props: {
  itemsNo: number;
  className?: string;
  children: (onLoad: () => void) => ReactNode | ReactNode[];
}) {
  const { itemsNo, className, children } = props;
  const [loadCount, setLoadCount] = useState(0);

  const handleLoad = () => {
    setLoadCount((prev) => prev + 1);
  };

  return (
    <div className={cn("flex relative overflow-hidden", className)}>
      {loadCount < itemsNo && <Skeleton className="w-full h-full absolute" />}
      {children(handleLoad)}
    </div>
  );
}
