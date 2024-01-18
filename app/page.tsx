"use client";

import { useRouter } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { FaChevronRight } from "react-icons/fa";
import { useMediaQuery } from "@/lib/hooks";
import { gtSm } from "@/lib/mediaQueries";
import Image from "next/image";

export default function Index() {
  const router = useRouter();
  const isNotMobile = useMediaQuery(gtSm);

  return (
    <div className="w-full h-full flex flex-col gap-12 md:gap-16 lg:gap-20 items-center">
      <AspectRatio
        ratio={isNotMobile ? 16 / 9 : 1}
        className="animate-in relative text-white rounded-lg md:rounded-2xl overflow-hidden"
      >
        <div className="flex flex-col w-full h-full items-center justify-center absolute z-20 bg-black/50 gap-4 md:gap-8 p-5">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-black drop-shadow-2xl text-center">
            Le stylo qu'il vous faut.
          </h1>
          <Button
            size={isNotMobile ? "lg" : "default"}
            className="flex items-center gap-2"
            onClick={() => router.push("/custom-order")}
          >
            Créez le vôtre <FaChevronRight />
          </Button>
        </div>
        <div className="h-full absolute z-10">
          <video className="h-full object-cover" autoPlay loop muted>
            <source
              src="/crayobois.mp4"
              type="video/mp4"
              className="scale-105 tranlate-y-5"
            />
          </video>
        </div>
      </AspectRatio>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full rounded-lg md:rounded-2xl gap-5">
        <div className="flex flex-col gap-3">
          <h3 className="inline-flex items-center text-lg sm:text-xl md:text-2xl font-bold h-9">
            Fait à la main au Québec{" "}
            <Quebec className="inline-flex w-9 md:w-12 h-max object-contain rounded-sm mx-3 shadow-lg" />
          </h3>
          <p className="text-lg p-0 md:pr-5">
            Explorez nos stylos uniques, façonnés avec soin par <b>Vincent Legros</b>{" "}
            et fièrement assemblés en <b>Outaouais, au Québec</b>. Personnalisez-les
            selon vos préférences - bois, style, matériaux. Exprimez votre style avec
            élégance.
          </p>
        </div>
        <Image
          src="/DSC01677.jpg"
          width={542}
          height={363}
          alt="image de menuisier"
          className="w-full h-full rounded-md"
        />
      </div>
    </div>
  );
}

function Quebec(props: { className?: string }) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="1200"
      height="800"
      viewBox="0 0 9600 6400"
      className={className}
    >
      <title>Drapeau du Québec</title>
      <path fill="#fff" d="m0 0h9600v6400H0z" />
      <g id="h">
        <g id="q">
          <path
            fill="#003da5"
            d="m4000 0v2400H0V0zm-1691 1622v-129h-115c0-66 32-130 66-150 20-17 65-25 104-5 51 29 54 113 28 151 243-45 219-280 136-365-67-69-140-79-196-58-128 46-214 199-218 427h-67c0-207 36-273 130-534 48-123 19-275-65-415-31-50-69-95-112-144-43 49-81 94-112 144-84 140-113 292-65 415 94 261 130 327 130 534h-67c-4-228-90-381-218-427-56-21-129-11-196 58-83 85-107 320 136 365-26-38-23-122 28-151 39-20 84-12 104 5 34 20 66 84 66 150h-115v129h239c-3 67-39 119-106 148 8 28 49 85 105 81 11 60 21 94 71 149 50-55 60-89 71-149 56 4 97-53 105-81-67-29-103-81-106-148z"
          />
        </g>
        <use xlinkHref="#q" x="5600" />
      </g>
      <use xlinkHref="#h" y="4000" />
    </svg>
  );
}
