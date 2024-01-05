"use client";

import { Button, Card, CardBody } from "@nextui-org/react";
import { cad } from "@/utils/currencyFormatter";
import ImageWithLoading from "./ImageWithLoading";
import { NonNullabbleProduct } from "@/utils/customProductFactory";
import { useCartStore } from "@/app/cart/store";
import { useState } from "react";
import { FaExpandAlt } from "react-icons/fa";
import { Tooltip } from "@nextui-org/react";
import { toast } from "sonner";

export default function ProductCard(props: { product: NonNullabbleProduct; onClick: () => void }) {
  const { product } = props;
  const { addToCart, isProductInCart } = useCartStore();
  const [isInCart, setIsInCart] = useState(isProductInCart(product));

  const handleAddToCart = () => {
    addToCart(product);
    setIsInCart(true);
    toast.success(`"${product.name}" a été ajouté à votre panier.`);
  };

  return (
    <Card shadow="sm" className="bg-background/60 dark:bg-default-100/50 " isFooterBlurred>
      <CardBody className="flex flex-col gap-4">
        <div className="relative">
          <ImageWithLoading
            width={225}
            height={225}
            src={product.image}
            alt={product.name}
            className="rounded-md"
            quality={100}
          />
          <Tooltip showArrow content="Agrandir">
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              className="absolute bottom-0 right-0 m-1 hover:bg-default/90"
            >
              <FaExpandAlt className="text-lg" />
            </Button>
          </Tooltip>
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
            <Button className="mt-auto" variant="faded" isDisabled>
              Dans le Panier
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
