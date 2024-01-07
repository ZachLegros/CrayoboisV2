"use client";

import { cad } from "@/utils/currencyFormatter";
import { useCartStore } from "./store";
import { Button, Chip, Radio, RadioGroup, Skeleton } from "@nextui-org/react";
import { useEffect, useMemo } from "react";
import { fetchShippingMethods } from "./actions";
import {
  getShippingPrice,
  getTotal,
  getTotalPrice,
  getTotalTPS,
  getTotalTVQ,
  isShippingFree,
} from "./utils";
import { useRouter } from "next/navigation";

export default function CartBreakdown() {
  const { cart, shippingMethods, setShippingMethods, shippingMethod, setShippingMethod } =
    useCartStore();
  const router = useRouter();

  useEffect(() => {
    async function getShipping() {
      const shippingMethods = await fetchShippingMethods();
      setShippingMethods(shippingMethods);
      setShippingMethod(shippingMethods[0].id);
    }
    if (shippingMethods.length === 0) getShipping();
  }, []);

  const freeShipping = useMemo(() => {
    return isShippingFree(cart);
  }, [cart]);

  const isLoading = useMemo(() => {
    return shippingMethods.length === 0;
  }, [shippingMethods]);

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
            <Chip color="secondary" size="sm">
              <p>Livraison gratuite</p>
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
      <div className="flex justify-between mt-2">
        <span>Sous-total</span>
        <span>{cad(getTotalPrice(cart))}</span>
      </div>
      <div className="flex justify-between">
        <span>TPS</span>
        <span>{cad(getTotalTPS(cart))}</span>
      </div>
      <div className="flex justify-between">
        <span>TVQ</span>
        <span>{cad(getTotalTVQ(cart))}</span>
      </div>
      <div className="flex justify-between">
        <span>Livraison</span>
        {shippingMethod ? (
          cad(getShippingPrice(shippingMethod, cart))
        ) : (
          <Skeleton className="w-16 rounded-md" />
        )}
      </div>
      <div className="flex justify-between text-2xl font-semibold text-gray-100 mt-2">
        <span>Total</span>
        {shippingMethod ? (
          <span>{cad(getTotal({ shippingMethod, cart }))}</span>
        ) : (
          <Skeleton className="w-24 h-8 rounded-md" />
        )}
      </div>
      <Button
        color="primary"
        size="lg"
        className="mt-2"
        isDisabled={isLoading}
        onClick={() => router.push("/checkout")}
      >
        Commander
      </Button>
    </div>
  );
}
