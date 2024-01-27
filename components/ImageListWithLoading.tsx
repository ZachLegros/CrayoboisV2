import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import { Children, ReactElement, cloneElement, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export default function ImageListWithLoading(props: {
  children: ReactElement<ImageProps>[] | ReactElement<ImageProps>;
  className?: string;
}) {
  const { className, children } = props;
  const itemsNo = Children.count(children);
  const [loadCount, setLoadCount] = useState(itemsNo);

  const handleLoad = () => {
    setLoadCount((prev) => prev + 1);
  };

  const images = Children.map(children, (child) => {
    if (child.type !== Image) return;
    return cloneElement(child, { onLoad: handleLoad });
  });

  return (
    <div className={cn("flex relative overflow-hidden", className)}>
      {loadCount <= itemsNo && <Skeleton className="w-full h-full absolute z-50" />}
      {images}
    </div>
  );
}
