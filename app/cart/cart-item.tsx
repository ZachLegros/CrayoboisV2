import { useCallback, useMemo, useState } from "react";
import { cad } from "@/lib/currencyFormatter";
import { CartItemType, CartProductType, useCartStore } from "./store";
import ImageWithLoading from "@/components/ImageWithLoading";
import Image from "next/image";
import ImageListWithLoading from "@/components/ImageListWithLoading";
import {
  DbProduct,
  isCustomProductWithComponents,
  isProduct,
} from "@/lib/productUtils";
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

const quantityRange = [...Array(100 + 1).keys()].slice(1, 100 + 1);

export default function CartItem(props: {
  item: CartItemType<CartProductType>;
  product: DbProduct;
  hasSeparator?: boolean;
}) {
  const { item, product, hasSeparator } = props;
  const { removeFromCart, setItemQuantity } = useCartStore();

  const [selectedQuantity, setSelectedQuantity] = useState(item.quantity);

  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value);
    setSelectedQuantity(quantity);
    setItemQuantity(product, quantity);
  };

  const quantityContent = useMemo(
    () => (
      <QuantityContent
        product={product}
        selectedQuantity={selectedQuantity}
        quantityRange={quantityRange}
        onQuantityChange={handleQuantityChange}
      />
    ),
    [product, selectedQuantity]
  );

  const handleRemoveFromCart = useCallback(() => removeFromCart(product), [product]);

  if (product === undefined) return null;

  return (
    <>
      <div className="grid grid-cols-cart-item gap-2 md:gap-4 md:grid-cols-cart-item-md h-[150px] w-full">
        <div className="flex rounded-sm overflow-hidden max-w-[150px] h-max">
          <ItemImages product={product} />
        </div>
        <Section title={product.name}>
          <span>{cad(product.price)}</span>
          {/* Mobile quantity */}
          <div className="flex flex-col gap-2 mt-auto md:hidden">
            <p className="font-semibold">Quantité</p>
            {quantityContent}
          </div>
        </Section>
        <Section title="Quantité" className="hidden md:flex">
          {quantityContent}
        </Section>
        <Section title="Sous-total" className="hidden md:flex w-full items-end">
          <span className="h-8">{cad(product.price * item.quantity)}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRemoveFromCart}
            className="w-max ml-auto mt-auto"
          >
            Retirer
          </Button>
        </Section>
        {/* Mobile remove */}
        <Section title="" className="flex md:hidden">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRemoveFromCart}
            className="w-max ml-auto mt-auto"
          >
            Retirer
          </Button>
        </Section>
      </div>
      {hasSeparator && <Separator />}
    </>
  );
}

const ItemImages = (props: { product: DbProduct }) => {
  const { product } = props;
  if (isCustomProductWithComponents(product)) {
    const { material, hardware } = product;
    return (
      <ImageListWithLoading className="flex-col md:flex-row" itemsNo={2}>
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

const Section = (props: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const { title, className, children } = props;
  return (
    <div
      className={cn(
        "flex flex-col gap-1 md:gap-4 text-sm md:text-md lg:text-lg",
        className
      )}
    >
      {!!title && <span className="font-semibold line-clamp-2">{title}</span>}
      {children}
    </div>
  );
};

const QuantityContent = (props: {
  product: DbProduct;
  selectedQuantity: number;
  quantityRange: number[];
  onQuantityChange: (value: string) => void;
}) => {
  const { product, selectedQuantity, quantityRange, onQuantityChange } = props;

  if (isCustomProductWithComponents(product) || product.quantity > 1) {
    return (
      <Select onValueChange={onQuantityChange}>
        <SelectTrigger className="text-xs h-8 w-16 md:text-sm">
          <SelectValue placeholder={selectedQuantity} />
        </SelectTrigger>
        <SelectContent className="h-52 md:h-96">
          {quantityRange.map((quantity) => (
            <SelectItem value={`${quantity}`} key={`${quantity}`}>
              {`${quantity}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1 h-8">
      <span className="w-2 h-2 bg-primary rounded-full"></span>1 en stock
    </Badge>
  );
};
