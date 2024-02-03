"use client";

import { Input, type InputProps } from "@/components/ui/input";
import { Cross1Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useState } from "react";
import { FaFileImage } from "react-icons/fa";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";

export default function ImageInput(
  props: InputProps & { onClear?: () => void; aspectRatio?: number },
) {
  const { onClear, aspectRatio = 1, ...otherProps } = props;
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
    props.onChange?.(event);
  };

  return (
    <div className="flex">
      {file ? (
        <AspectRatio ratio={aspectRatio} className="relative">
          <Button
            size="icon"
            variant="secondary"
            className="absolute size-6 right-0 m-1 z-10 opacity-80"
            onClick={() => {
              setFile(null);
              onClear?.();
            }}
          >
            <Cross1Icon className="size-3" />
          </Button>
          <Image
            src={URL.createObjectURL(file)}
            width={200}
            height={200}
            alt="product image"
            className="object-cover w-full h-full rounded-md"
          />
        </AspectRatio>
      ) : (
        <AspectRatio
          ratio={aspectRatio}
          className="flex items-center justify-center relative border-2 border-dashed rounded-md"
        >
          <Input
            type="file"
            id="uploadImage"
            accept="image/jpeg"
            className="h-full w-full opacity-0 cursor-pointer"
            {...otherProps}
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-3 absolute pointer-events-none">
            <FaFileImage className="text-foreground/80 text-5xl" />
            <p className="underline text-foreground/80">Selectionner une image</p>
          </div>
        </AspectRatio>
      )}
    </div>
  );
}
