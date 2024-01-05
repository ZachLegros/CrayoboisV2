import { twMerge } from "tailwind-merge";
import { cad } from "@/utils/currencyFormatter";
import { Chip, Button, Select, SelectItem } from "@nextui-org/react";
import { CartItemType, getProductMaxQuantity, useCartStore } from "./store";
import { ChangeEvent } from "react";
import {
  NonNullabbleProduct,
  NonNullabbleProductWithComponents,
} from "@/utils/customProductFactory";
import ImageWithLoading from "@/components/ImageWithLoading";
import Image from "next/image";
import ImageListWithLoading from "@/components/ImageListWithLoading";

export default function CartItem(props: { item: CartItemType }) {
  const { item } = props;
  const { product } = item;
  const { removeFromCart, setItemQuantity } = useCartStore();

  const Section = (props: { title: string; className?: string; children: React.ReactNode }) => {
    const { title, className, children } = props;
    return (
      <div className={twMerge("flex flex-col gap-2 text-lg", className)}>
        <span className="font-semibold">{title}</span>
        {children}
      </div>
    );
  };

  const getQuantityRange = (quantity: number) =>
    [...Array(quantity + 1).keys()].slice(1, quantity + 1);

  const handleQuantityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const quantity = parseInt(e.target.value);
    setItemQuantity(product, quantity);
  };

  const getImageComponents = () => {
    if (product.is_custom) {
      const productWithComponents = product as NonNullabbleProductWithComponents;
      const { material, hardware } = productWithComponents;

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
    return (
      <ImageWithLoading
        width={150}
        height={150}
        src={(product as NonNullabbleProduct).image}
        alt={product.name}
        quality={80}
      />
    );
  };

  return (
    <div className="grid grid-cols-cart-item gap-4 h-[150px] w-full">
      <div className="flex rounded-md overflow-hidden w-[150px] h-max">{getImageComponents()}</div>
      <Section title={product.name}>
        <span>{cad(product.price)}</span>
      </Section>
      <Section title="Quantité">
        {product.is_custom || product.quantity > 1 ? (
          <Select
            size="sm"
            defaultSelectedKeys={[`${item.quantity}`]}
            onChange={handleQuantityChange}
            aria-label="Quantité"
          >
            {getQuantityRange(getProductMaxQuantity(product)).map((quantity) => (
              <SelectItem key={`${quantity}`} value={`${quantity}`}>
                {`${quantity}`}
              </SelectItem>
            ))}
          </Select>
        ) : (
          <div className="flex gap-4">
            <p>1</p>
            <Chip color="warning" variant="dot">
              1 en stock
            </Chip>
          </div>
        )}
      </Section>
      <Section title="Sous-total" className="items-end">
        <div className="flex flex-col justify-between h-full">
          <span>{cad(product.price * item.quantity)}</span>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onClick={() => removeFromCart(product)}
            className="w-max ml-auto"
          >
            Retirer
          </Button>
        </div>
      </Section>
    </div>
  );
}
