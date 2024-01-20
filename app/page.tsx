"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { FaChevronRight } from "react-icons/fa";
import { useMediaQuery } from "@/lib/hooks";
import { gtSm } from "@/lib/mediaQueries";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ImageWithLoading from "@/components/ImageWithLoading";
import { getProductImages } from "./actions";

export default function Index() {
  const router = useRouter();
  const isNotMobile = useMediaQuery(gtSm);
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    const getImages = async () => {
      const images = await getProductImages(10);
      setProductImages(images);
    };
    getImages();
  }, []);

  return (
    <div className="animate-in w-full h-full flex flex-col gap-10 md:gap-15 lg:gap-20 items-center">
      <AspectRatio
        ratio={isNotMobile ? 16 / 9 : 1}
        className="relative text-white rounded-lg md:rounded-2xl overflow-hidden max-h-[693px]"
      >
        <div className="flex flex-col w-full h-full items-center justify-center absolute z-20 bg-black/50 gap-4 md:gap-8 p-5">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-black drop-shadow-2xl text-center">
            Le stylo qu'il vous faut.
          </h1>
          <Button
            size={isNotMobile ? "lg" : "default"}
            className="flex items-center gap-1"
            onClick={() => router.push("/custom-order")}
          >
            Créez votre stylo
            <FaChevronRight />
          </Button>
        </div>
        <div className="h-full absolute z-10">
          <video className="h-full object-cover" autoPlay loop muted>
            <source
              src="https://crayobois.s3.amazonaws.com/crayobois.mp4"
              type="video/mp4"
              className="scale-105 tranlate-y-5"
            />
          </video>
        </div>
      </AspectRatio>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full rounded-lg md:rounded-2xl gap-5">
        <div className="flex flex-col gap-3">
          <h3 className="inline-flex items-center text-lg sm:text-xl md:text-2xl font-bold h-9">
            Nos produits
          </h3>
          <p className="text-lg p-0 md:pr-5">
            Explorez notre séléction de produits préfabriqués de{" "}
            <b>qualité supérieure</b>, comprenant des <b>éditions spéciales</b>.
            Parmi notre gamme, retrouvez des stylos, des rasoirs, des porte-clés, des
            porte-mines, et bien d'autres articles.
          </p>
          <Button className="w-max mt-4" onClick={() => router.push("/products")}>
            Explorer les produits
          </Button>
        </div>
        <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full">
          <CarouselContent className="-ml-1">
            {productImages.map((image, index) => (
              <CarouselItem key={index} className="pl-1 basis-1/2 lg:basis-1/3">
                <ImageWithLoading
                  src={image}
                  width={200}
                  height={200}
                  alt="produit"
                  className="rounded-md"
                  quality={60}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full rounded-lg md:rounded-2xl gap-5">
        <div className="flex flex-col gap-3">
          <h3 className="inline-flex items-center text-lg sm:text-xl md:text-2xl font-bold h-9">
            Fait à la main au Québec{" "}
            <Image
              src="/quebec.jpg"
              width={50}
              height={30.3}
              alt="quebec"
              className="inline-flex w-9 md:w-12 h-max object-contain rounded-sm mx-3 shadow-md"
            />
          </h3>
          <p className="text-lg p-0 md:pr-5">
            Découvrez nos stylos uniques, façonnés avec soin par{" "}
            <b>Vincent Legros</b> et fièrement assemblés en{" "}
            <b>Outaouais, au Québec</b>. Personnalisez-les selon vos préférences -
            bois, style, matériaux. Exprimez votre style avec élégance.
          </p>
          <Button
            className="w-max mt-4"
            onClick={() => router.push("/custom-product")}
          >
            Créez votre stylo
          </Button>
        </div>
        <Image
          src="/DSC01677.jpg"
          width={542}
          height={363}
          alt="image de menuisier"
          className="w-full h-full rounded-md"
          loading="eager"
        />
      </div>
    </div>
  );
}
