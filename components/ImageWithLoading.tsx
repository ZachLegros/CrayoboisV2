import { Skeleton } from "@nextui-org/react";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export type ImageWithLoadingProps = Omit<ImageProps, "onLoadingComplete" | "loading"> & {
  className?: string;
};

export default function ImageWithLoading(props: ImageWithLoadingProps) {
  const { className, src, alt, ...rest } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={twMerge("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        {...rest}
        onLoadingComplete={() => setIsLoaded(true)}
        loading="lazy"
      />
      {!isLoaded && <Skeleton className="absolute top-0 left-0 w-full h-full" />}
    </div>
  );
}
