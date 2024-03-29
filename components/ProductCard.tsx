"use client";

import { useCartStore } from "@/app/cart/store";
import { useToast } from "@/components/ui/use-toast";
import { cad } from "@/lib/currencyFormatter";
import type { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaExpandAlt } from "react-icons/fa";
import ImageWithLoading from "./ImageWithLoading";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";
import { ToastAction } from "./ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function ProductCard(props: {
  product: Product;
  onClick: () => void;
}) {
  const { product } = props;
  const router = useRouter();
  const { toast } = useToast();
  const { cart } = useCartStore();
  const [isInCart, setIsInCart] = useState(cart.has(product.id));
  const [isOpen, setIsOpen] = useState(false);

  const handleaddItem = () => {
    cart.addItem(product);
    setIsInCart(true);
    toast({
      title: `"${product.name}" a été ajouté à votre panier.`,
      action: (
        <ToastAction altText="Aller au panier" onClick={() => router.push("/cart")}>
          Aller au panier
        </ToastAction>
      ),
    });
  };

  return (
    <>
      <Card className="flex flex-col gap-4 p-3">
        <div className="relative">
          <ImageWithLoading
            width={225}
            height={225}
            src={product.image}
            alt={product.name}
            className="rounded-md cursor-pointer"
            quality={70}
            onClick={() => setIsOpen(true)}
          />
          <div className="absolute bottom-0 right-0 m-1 ">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="opacity-60"
                    onClick={() => setIsOpen(true)}
                  >
                    <FaExpandAlt className="text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-foreground text-background">
                  Agrandir
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex flex-col gap-2 text-lg">
            <b>{product.name}</b>
            <p>{cad(product.price)}</p>
          </div>
          {!isInCart ? (
            <Button color="primary" className="mt-auto" onClick={handleaddItem}>
              Ajouter au Panier
            </Button>
          ) : (
            <Button variant="outline" className="mt-auto" disabled>
              Dans le Panier
            </Button>
          )}
        </div>
      </Card>
      <ExpandImage
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        src={product.image}
        alt={product.name}
      />
    </>
  );
}

export function ExpandImage(props: {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  src: string;
  alt: string;
}) {
  const { isOpen, onOpenChange, src, alt } = props;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] max-h-[500px] p-0 rounded-xl overflow-hidden">
        <ImageWithLoading
          src={src}
          alt={alt}
          width={500}
          height={500}
          className="w-full h-full object-contain"
          quality={90}
        />
      </DialogContent>
    </Dialog>
  );
}
