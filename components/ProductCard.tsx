"use client";

import { cad } from "@/utils/currencyFormatter";
import ImageWithLoading from "./ImageWithLoading";
import { useCartStore } from "@/app/cart/store";
import { useState } from "react";
import { FaExpandAlt } from "react-icons/fa";
import { Product } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
// import { Tooltip } from "./ui/tooltip";

export function ExpandImage(props: {
  isExpanded?: boolean;
  src: string;
  alt: string;
}) {
  const { isExpanded, src, alt } = props;
  return (
    <Dialog open={isExpanded}>
      <DialogTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-0 right-0 m-1"
        >
          <FaExpandAlt className="text-lg" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ImageWithLoading
          src={src}
          alt={alt}
          width={500}
          height={500}
          quality={80}
        />
      </DialogContent>
    </Dialog>
  );
}

export default function ProductCard(props: {
  product: Product;
  onClick: () => void;
}) {
  const { product } = props;
  const { toast } = useToast();
  const { addToCart, isProductInCart } = useCartStore();
  const [isInCart, setIsInCart] = useState(isProductInCart(product));
  const [, setIsOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsInCart(true);
    toast({ title: `"${product.name}" a été ajouté à votre panier.` });
  };

  return (
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
        {/* <ExpandImage isExpanded={isOpen} src={product.image} alt={product.name} /> */}
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex flex-col gap-2 text-lg">
          <b>{product.name}</b>
          <p>{cad(product.price)}</p>
        </div>
        {!isInCart ? (
          <Button color="primary" className="mt-auto" onClick={handleAddToCart}>
            Ajouter au Panier
          </Button>
        ) : (
          <Button
            className="mt-auto border-opacity-100 bg-slate-300 dark:bg-slate-700"
            variant="outline"
            disabled
          >
            Dans le Panier
          </Button>
        )}
      </div>
    </Card>
  );
}
