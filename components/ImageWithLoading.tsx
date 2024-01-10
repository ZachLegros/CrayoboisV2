import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

export type ImageWithLoadingProps = Omit<ImageProps, "loading"> & {
  className?: string;
  onLoad?: () => void;
};

export default function ImageWithLoading(props: ImageWithLoadingProps) {
  const { className, src, alt, onLoad, ...rest } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        {...rest}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      {!isLoaded && <Skeleton className="absolute top-0 left-0 w-full h-full" />}
    </div>
  );
}
