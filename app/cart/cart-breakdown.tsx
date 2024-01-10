"use client";

import { cad } from "@/utils/currencyFormatter";
import { useCartStore } from "./store";
import { Button, Chip, Radio, RadioGroup, Skeleton } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { fetchShippingMethods } from "./actions";
import { useRouter } from "next/navigation";

export default function CartBreakdown() {
  const {
    cart,
    shippingMethods,
    setShippingMethods,
    shippingMethod,
    setShippingMethod,
    getShippingPrice,
    getTotal,
    getTotalPrice,
    getTotalTPS,
    getTotalTVQ,
    isShippingFree,
  } = useCartStore();
  const router = useRouter();
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    async function getShipping() {
      const shippingMethods = await fetchShippingMethods();
      setShippingMethods(shippingMethods);
      setShippingMethod(shippingMethods[0]?.id);
    }
    if (shippingMethods.length === 0) getShipping();
  }, []);

  const freeShipping = useMemo(() => {
    if (isShippingFree()) {
      setShippingMethod(shippingMethods.filter((method) => method.price === 0)?.[0]?.id);
      return true;
    }
    return false;
  }, [cart]);

  const isLoading = useMemo(() => {
    return shippingMethods.length === 0;
  }, [shippingMethods]);

  return (
    <div className="flex flex-col gap-2 w-full text-l">
      <div className="flex flex-col gap-2 mb-2">
        <p>Méthode de livraison</p>
        <p className="text-foreground/50">
          {`La livraison est gratuite pour toutes commandes ayant un sous-total ${cad(
            150
          )} et plus ou
          l'achat d'au moins 4 produits.`}
        </p>
        {shippingMethods.length > 0 ? (
          freeShipping ? (
            <Chip color="secondary" size="sm">
              <p className="font-medium text-slate-50">Livraison gratuite</p>
            </Chip>
          ) : (
            <RadioGroup
              defaultValue={`${shippingMethods[0].id}`}
              size="md"
              onValueChange={(id: string) => setShippingMethod(id)}
            >
              {shippingMethods
                .filter((method) => method.price !== 0)
                .map((method, index) => (
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
      <div className="flex justify-between mt-2">
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
      <Button
        color="primary"
        size="lg"
        className="mt-2"
        isDisabled={isLoading || isButtonLoading}
        onClick={() => {
          setIsButtonLoading(true);
          router.push("/checkout");
        }}
        isLoading={isButtonLoading}
      >
        Commander
      </Button>
    </div>
  );
}
