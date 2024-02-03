"use client";

import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";
import { FaFileImage } from "react-icons/fa";
import ImageWithLoading from "./ImageWithLoading";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";

export default function ImageInput(
  props: Omit<InputProps, "onChange"> & {
    defaultImage?: string;
    onChange?: (b64Image: string) => void;
    onClear?: () => void;
    aspectRatio?: number;
    className?: string;
  },
) {
  const {
    onClear,
    aspectRatio = 1,
    defaultImage = null,
    className,
    ...otherProps
  } = props;
  const [image, setImage] = useState<string | null>(defaultImage);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataURI = reader.result;
          const img = new Image();
          img.onload = async () => {
            const resizedImageURI = resizeImage(img, 400);
            props.onChange?.(resizedImageURI);
            setImage(resizedImageURI);
          };
          img.src = dataURI as string;
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    },
    [],
  );

  return (
    <div className={cn("flex", className)}>
      {image ? (
        <AspectRatio ratio={aspectRatio} className="relative">
          <Button
            size="icon"
            variant="secondary"
            className="absolute size-6 right-0 m-1 z-10 opacity-80"
            onClick={() => {
              setImage(null);
              onClear?.();
            }}
          >
            <Cross1Icon className="size-3" />
          </Button>
          <ImageWithLoading
            src={image}
            width={200}
            height={200}
            alt="Image from input"
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

function resizeImage(imgEl: HTMLImageElement, width: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const aspect = imgEl.width / imgEl.height;

  canvas.width = width;
  canvas.height = width / aspect;

  ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
}
