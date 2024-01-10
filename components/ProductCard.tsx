"use client";

import { Button, CardBody, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import Card from "@/components/Card";
import { cad } from "@/utils/currencyFormatter";
import ImageWithLoading from "./ImageWithLoading";
import { useCartStore } from "@/app/cart/store";
import { useState } from "react";
import { FaExpandAlt } from "react-icons/fa";
import { Tooltip } from "@nextui-org/react";
import { toast } from "sonner";
import { Product } from "@prisma/client";

export default function ProductCard(props: { product: Product; onClick: () => void }) {
  const { product } = props;
  const { addToCart, isProductInCart } = useCartStore();
  const [isInCart, setIsInCart] = useState(isProductInCart(product));
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsInCart(true);
    toast.success(`"${product.name}" a été ajouté à votre panier.`);
  };

  return (
    <>
      <Card>
        <CardBody className="flex flex-col gap-4">
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
            <Tooltip showArrow content="Agrandir">
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                className="absolute bottom-0 right-0 m-1"
                onClick={() => setIsOpen(true)}
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
              <Button
                className="mt-auto border-opacity-100 bg-slate-300 dark:bg-slate-700"
                variant="bordered"
                isDisabled
              >
                Dans le Panier
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          closeButton:
            "transition-colors text-foreground bg-slate-200/50 hover:bg-slate-300/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 z-10",
        }}
      >
        <ModalContent>
          <ModalBody className="p-0 rounded-lg overflow-hidden">
            <ImageWithLoading
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              quality={80}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
