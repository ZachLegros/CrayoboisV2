"use client";

import { cad } from "@/utils/currencyFormatter";
import { useCartStore } from "./store";
import { Radio, RadioGroup, Skeleton } from "@nextui-org/react";
import { useEffect } from "react";
import { fetchShippingMethods } from "./actions";

export default function CartBreakdown() {
  const { cart, shippingMethods, setShippingMethods, shippingMethod, setShippingMethod } =
    useCartStore();

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

  const getShippingPrice = () => {
    if (!shippingMethod) return 0;
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

  return (
    <div className="flex flex-col gap-2 w-full text-lg text-gray-300">
      <div className="flex flex-col gap-2 mb-2">
        <p>Méthode de livraison</p>
        {shippingMethods.length > 0 ? (
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
        ) : (
          <Skeleton className="w-full h-14 rounded-md" />
        )}
      </div>
      <div className="flex justify-between">
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
        {shippingMethod ? cad(shippingMethod.price) : <Skeleton className="w-16 rounded-md" />}
      </div>
      <div className="flex justify-between text-2xl font-semibold text-gray-100 mt-2">
        <span>Total</span>
        <span>{cad(getTotal())}</span>
      </div>
    </div>
  );
}
