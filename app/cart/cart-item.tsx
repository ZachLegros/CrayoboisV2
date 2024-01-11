import { useState } from "react";
import { cad } from "@/utils/currencyFormatter";
import { CartItemType, CartProductType, useCartStore } from "./store";
import ImageWithLoading from "@/components/ImageWithLoading";
import Image from "next/image";
import ImageListWithLoading from "@/components/ImageListWithLoading";
import {
  DbProduct,
  isCustomProductWithComponents,
  isProduct,
} from "@/utils/productUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const getImageComponents = (product: DbProduct) => {
  if (isCustomProductWithComponents(product)) {
    const { material, hardware } = product;
    return (
      <ImageListWithLoading itemsNo={2}>
        {(onLoad) => (
          <>
            <Image
              width={75}
              height={75}
              src={material.image}
              alt={material.name}
              quality={70}
              loading="eager"
              onLoad={onLoad}
            />
            <Image
              width={75}
              height={75}
              src={hardware.image}
              alt={hardware.name}
              quality={70}
              loading="eager"
              onLoad={onLoad}
            />
          </>
        )}
      </ImageListWithLoading>
    );
  }
  if (isProduct(product)) {
    return (
      <ImageWithLoading
        width={150}
        height={150}
        src={product.image}
        alt={product.name}
        quality={80}
      />
    );
  }
  return null;
};

export default function CartItem(props: {
  item: CartItemType<CartProductType>;
  hasSeparator?: boolean;
}) {
  const { item, hasSeparator } = props;
  const { product: cartItem } = item;
  const { removeFromCart, setItemQuantity, cartItemData } = useCartStore();

  const product = cartItemData[cartItem.id];
  const [quantityRange] = useState([...Array(100 + 1).keys()].slice(1, 100 + 1));
  const [selectedQuantity, setSelectedQuantity] = useState(item.quantity);

  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value);
    setSelectedQuantity(quantity);
    setItemQuantity(cartItem, quantity);
  };

  const Section = (props: {
    title: string;
    className?: string;
    children: React.ReactNode;
  }) => {
    const { title, className, children } = props;
    return (
      <div className={cn("flex flex-col gap-2 text-lg", className)}>
        <span className="font-semibold">{title}</span>
        {children}
      </div>
    );
  };

  if (product === undefined) return null;

  return (
    <>
      <div className="grid grid-cols-cart-item gap-4 h-[150px] w-full">
        <div className="flex rounded-sm overflow-hidden w-[150px] h-max">
          {getImageComponents(product)}
        </div>
        <Section title={product.name}>
          <span>{cad(product.price)}</span>
        </Section>
        <Section title="Quantité">
          {isCustomProductWithComponents(product) || product.quantity > 1 ? (
            <Select onValueChange={handleQuantityChange}>
              <SelectTrigger>
                <SelectValue placeholder={selectedQuantity} />
              </SelectTrigger>
              <SelectContent>
                {quantityRange.map((quantity) => (
                  <SelectItem key={`${quantity}`} value={`${quantity}`}>
                    {`${quantity}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <span className="w-2 h-2 bg-primary rounded-full"></span>1 en stock
            </Badge>
          )}
        </Section>
        <Section title="Sous-total" className="items-end">
          <div className="flex flex-col justify-between h-full">
            <span>{cad(product.price * item.quantity)}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeFromCart(product)}
              className="w-max ml-auto"
            >
              Retirer
            </Button>
          </div>
        </Section>
      </div>
      {hasSeparator && <Separator />}
    </>
  );
}
