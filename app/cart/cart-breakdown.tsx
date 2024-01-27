"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { cad } from "@/lib/currencyFormatter";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "./store";

export default function CartBreakdown(props: { hasAction?: boolean }) {
  const { hasAction = true } = props;
  const router = useRouter();
  const { cart, cartState } = useCartStore();
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const nonFreeShippingMethods = useMemo(() => {
    return cartState.shippingMethods.filter((method) => method.price !== 0);
  }, [cartState.shippingMethods]);

  useEffect(() => {
    if (cartState.shippingMethods.length === 0) {
      cart.fetchShippingMethods();
    }
  }, [cartState.shippingMethods, cartState.shipping]);

  const isLoading = useMemo(() => {
    return cartState.shippingMethods.length === 0;
  }, [cartState.shippingMethods]);

  return (
    <>
      <div className="flex flex-col gap-2 mb-2">
        <p className="font-semibold">Méthode de livraison</p>
        <p>
          {`La livraison est gratuite pour toutes commandes ayant un sous-total ${cad(
            150,
          )} et plus ou
          l'achat d'au moins 4 produits.`}
        </p>
        <div className="min-h-12">
          {nonFreeShippingMethods.length > 0 ? (
            cartState.shipping?.price === 0 ? (
              <Badge variant="default-faded">Livraison gratuite!</Badge>
            ) : (
              <RadioGroup onValueChange={(id: string) => cart.setShippingMethod(id)}>
                {nonFreeShippingMethods.map((method) => (
                  <div className="flex items-center space-x-2" key={method.id}>
                    <RadioGroupItem
                      checked={cartState.shipping?.id === method.id}
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
      <div className="flex flex-col min-w-60">
        <div className="flex justify-between mt-2">
          <span>Sous-total</span>
          <span>{cad(cartState.breakdown.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>TPS</span>
          <span>{cad(cartState.breakdown.tps)}</span>
        </div>
        <div className="flex justify-between">
          <span>TVQ</span>
          <span>{cad(cartState.breakdown.tvq)}</span>
        </div>
        <div className="flex justify-between">
          <span>Livraison</span>
          {!isLoading ? (
            cad(cartState.breakdown.shipping)
          ) : (
            <Skeleton className="w-16" />
          )}
        </div>
        <div className="flex justify-between text-lg md:text-xl lg:text-2xl font-semibold mt-2">
          <span>Total</span>
          {!isLoading ? (
            <span>{cad(cartState.breakdown.total)}</span>
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
      </div>
    </>
  );
}
