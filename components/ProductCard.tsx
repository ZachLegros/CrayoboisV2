"use client";

import { Button, Card, CardBody } from "@nextui-org/react";
import { cad } from "@/utils/currencyFormatter";
import ImageWithLoading from "./ImageWithLoading";
import { NonNullabbleProduct } from "@/utils/customProductFactory";
import { useCartStore } from "@/app/cart/store";
import { useEffect, useState } from "react";

export default function ProductCard(props: { product: NonNullabbleProduct; onClick: () => void }) {
  const { product } = props;
  const { cart, addToCart, isProductInCart } = useCartStore();
  const [isInCart, setIsInCart] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsInCart(true);
  };

  useEffect(() => {
    setIsInCart(isProductInCart(product));
  }, [cart]);

  return (
    <Card shadow="sm" className="bg-background/60 dark:bg-default-100/50 " isFooterBlurred>
      <CardBody className="flex flex-col gap-4">
        <ImageWithLoading
          width={225}
          height={225}
          src={product.image}
          alt={product.name}
          className="rounded-md !w-full"
          quality={100}
        />
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
