import { ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "./ui/skeleton";

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
    <div className={twMerge("flex relative overflow-hidden", className)}>
      {loadCount < itemsNo && <Skeleton className="w-full h-full absolute" />}
      {children(handleLoad)}
    </div>
  );
}
