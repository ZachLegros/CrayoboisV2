"use client";

import { cad } from "@/lib/currencyFormatter";
import { useCartStore } from "./store";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CartBreakdown(props: { hasAction?: boolean }) {
  const { hasAction = true } = props;
  const router = useRouter();
  const {
    shippingMethod,
    setShippingMethod,
    shippingMethods,
    getBreakdown,
    fetchShipping,
    inferShippingMethod,
  } = useCartStore();
  const { subtotal, tps, tvq, shipping, total } = getBreakdown();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const nonFreeShippingMethods = useMemo(() => {
    return shippingMethods.filter((method) => method.price !== 0);
  }, [shippingMethods]);

  useEffect(() => {
    if (shippingMethods.length === 0) {
      fetchShipping();
    } else if (!shippingMethod) {
      inferShippingMethod();
    }
  }, [shippingMethods]);

  const isLoading = useMemo(() => {
    return shippingMethods.length === 0;
  }, [shippingMethods]);

  return (
    <>
      <div className="flex flex-col gap-2 mb-2">
        <p className="font-semibold">Méthode de livraison</p>
        <p>
          {`La livraison est gratuite pour toutes commandes ayant un sous-total ${cad(
            150
          )} et plus ou
          l'achat d'au moins 4 produits.`}
        </p>
        <div className="min-h-12">
          {nonFreeShippingMethods.length > 0 ? (
            shippingMethod?.price === 0 ? (
              <Badge variant="default-faded">Livraison gratuite!</Badge>
            ) : (
              <RadioGroup onValueChange={(id: string) => setShippingMethod(id)}>
                {nonFreeShippingMethods.map((method, index) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <RadioGroupItem
                      checked={shippingMethod?.id === method.id}
                      value={`${method.id}`}
                      id={method.id}
                    />
                    <Label htmlFor={method.id} className="cursor-pointer">
                      {method.name} ({cad(method.price)})
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )
          ) : (
            <Skeleton className="w-full h-12" />
          )}
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <span>Sous-total</span>
        <span>{cad(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span>TPS</span>
        <span>{cad(tps)}</span>
      </div>
      <div className="flex justify-between">
        <span>TVQ</span>
        <span>{cad(tvq)}</span>
      </div>
      <div className="flex justify-between">
        <span>Livraison</span>
        {shippingMethod ? cad(shipping) : <Skeleton className="w-16" />}
      </div>
      <div className="flex justify-between text-lg md:text-xl lg:text-2xl font-semibold mt-2">
        <span>Total</span>
        {shippingMethod ? (
          <span>{cad(total)}</span>
        ) : (
          <Skeleton className="w-24 h-8" />
        )}
      </div>
      {hasAction && (
        <Button
          size="lg"
          className="mt-2"
          disabled={isLoading || isButtonLoading}
          onClick={() => {
            setIsButtonLoading(true);
            router.push("/checkout");
          }}
          isLoading={isButtonLoading}
        >
          Commander
        </Button>
      )}
    </>
  );
}
