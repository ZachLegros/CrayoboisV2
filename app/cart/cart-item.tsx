import { twMerge } from "tailwind-merge";
import { cad } from "@/utils/currencyFormatter";
import { Chip, Button, Select, SelectItem, Divider } from "@nextui-org/react";
import { CartItemType, CartProductType, useCartStore } from "./store";
import { ChangeEvent, useState } from "react";
import ImageWithLoading from "@/components/ImageWithLoading";
import Image from "next/image";
import ImageListWithLoading from "@/components/ImageListWithLoading";
import { DbProduct, isCustomProductWithComponents, isProduct } from "@/utils/productUtils";

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
  hasDivider?: boolean;
}) {
  const { item, hasDivider } = props;
  const { product: cartItem } = item;
  const { removeFromCart, setItemQuantity, cartItemData } = useCartStore();

  const product = cartItemData[cartItem.id];
  const [quantityRange] = useState([...Array(100 + 1).keys()].slice(1, 100 + 1));

  const handleQuantityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const quantity = parseInt(e.target.value);
    setItemQuantity(cartItem, quantity);
  };

  const Section = (props: { title: string; className?: string; children: React.ReactNode }) => {
    const { title, className, children } = props;
    return (
      <div className={twMerge("flex flex-col gap-2 text-lg", className)}>
        <span className="font-semibold">{title}</span>
        {children}
      </div>
    );
  };

  if (product === undefined) return null;

  return (
    <>
      <div className="grid grid-cols-cart-item gap-4 h-[150px] w-full">
        <div className="flex rounded-md overflow-hidden w-[150px] h-max">
          {getImageComponents(product)}
        </div>
        <Section title={product.name}>
          <span>{cad(product.price)}</span>
        </Section>
        <Section title="Quantité">
          {isCustomProductWithComponents(product) || product.quantity > 1 ? (
            <Select
              size="sm"
              defaultSelectedKeys={[`${item.quantity}`]}
              onChange={handleQuantityChange}
              aria-label="Quantité"
            >
              {quantityRange.map((quantity) => (
                <SelectItem key={`${quantity}`} value={`${quantity}`}>
                  {`${quantity}`}
                </SelectItem>
              ))}
            </Select>
          ) : (
            <Chip color="warning" variant="dot">
              1 en stock
            </Chip>
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
      {hasDivider && <Divider />}
    </>
  );
}
