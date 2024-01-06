"use client";

import { cad } from "@/utils/currencyFormatter";
import { useCartStore } from "./store";
import { Chip, Radio, RadioGroup, Skeleton } from "@nextui-org/react";
import { useEffect, useMemo } from "react";
import { fetchShippingMethods } from "./actions";

export default function CartBreakdown() {
  const {
    cart,
    shippingMethods,
    setShippingMethods,
    shippingMethod,
    setShippingMethod,
    getCartTotalQuantity,
  } = useCartStore();

  const getTotalPrice = () => {
    return cart.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);
  };

  const getTotalTPS = () => {
    return cart.reduce((acc, item) => {
      return acc + item.product.price * item.quantity * 0.05;
    }, 0);
  };

  const getTotalTVQ = () => {
    return cart.reduce((acc, item) => {
      return acc + item.product.price * item.quantity * 0.09975;
    }, 0);
  };

  const isShippingFree = () => {
    return getCartTotalQuantity() >= 4 || getTotalPrice() >= 150;
  };

  const getShippingPrice = () => {
    if (!shippingMethod || isShippingFree()) return 0;
    return shippingMethod.price;
  };

  const getTotal = () => {
    return getTotalPrice() + getTotalTPS() + getTotalTVQ() + getShippingPrice();
  };

  useEffect(() => {
    async function getShipping() {
      const shippingMethods = await fetchShippingMethods();
      setShippingMethods(shippingMethods);
      setShippingMethod(shippingMethods[0].id);
    }
    if (shippingMethods.length === 0) getShipping();
  }, []);

  const freeShipping = useMemo(() => {
    return isShippingFree();
  }, [cart]);

  return (
    <div className="flex flex-col gap-2 w-full text-l">
      <div className="flex flex-col gap-2 mb-2">
        <p>Méthode de livraison</p>
        <p className="text-gray-400">
          La livraison est gratuite pour toutes commandes excédant une valeur de 150 $ ou l'achat de
          4 stylos et plus.
        </p>
        {shippingMethods.length > 0 ? (
          freeShipping ? (
            <Chip color="success">
              <p className="font-semibold">Livraison gratuite</p>
            </Chip>
          ) : (
            <RadioGroup
              defaultValue={`${shippingMethods[0].id}`}
              size="md"
              onValueChange={(id: string) => setShippingMethod(parseInt(id))}
            >
              {shippingMethods.map((method, index) => (
                <Radio value={`${method.id}`} key={index}>
                  {method.name} ({cad(method.price)})
                </Radio>
              ))}
            </RadioGroup>
          )
        ) : (
          <Skeleton className="w-full h-14 rounded-md" />
        )}
      </div>
      <div className="flex justify-between mt-3">
        <span>Sous-total</span>
        <span>{cad(getTotalPrice())}</span>
      </div>
      <div className="flex justify-between">
        <span>TPS</span>
        <span>{cad(getTotalTPS())}</span>
      </div>
      <div className="flex justify-between">
        <span>TVQ</span>
        <span>{cad(getTotalTVQ())}</span>
      </div>
      <div className="flex justify-between">
        <span>Livraison</span>
        {shippingMethod ? cad(getShippingPrice()) : <Skeleton className="w-16 rounded-md" />}
      </div>
      <div className="flex justify-between text-2xl font-semibold text-gray-100 mt-2">
        <span>Total</span>
        {shippingMethod ? (
          <span>{cad(getTotal())}</span>
        ) : (
          <Skeleton className="w-24 h-8 rounded-md" />
        )}
      </div>
    </div>
  );
}
