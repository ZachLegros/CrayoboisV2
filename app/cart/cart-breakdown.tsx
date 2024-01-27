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
  const { cart } = useCartStore();
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const nonFreeShippingMethods = useMemo(() => {
    return cart.shippingMethods.filter((method) => method.price !== 0);
  }, [cart.shippingMethods]);

  useEffect(() => {
    if (cart.shippingMethods.length === 0) {
      cart.fetchShippingMethods();
    } else if (!cart.shipping) {
      cart.inferShippingMethod();
    }
  }, [cart.shippingMethods, cart.shipping]);

  const isLoading = useMemo(() => {
    return cart.shippingMethods.length === 0;
  }, [cart.shippingMethods]);

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
            cart.shipping?.price === 0 ? (
              <Badge variant="default-faded">Livraison gratuite!</Badge>
            ) : (
              <RadioGroup onValueChange={(id: string) => cart.setShippingMethod(id)}>
                {nonFreeShippingMethods.map((method) => (
                  <div className="flex items-center space-x-2" key={method.id}>
                    <RadioGroupItem
                      checked={cart.shipping?.id === method.id}
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
          <span>{cad(cart.breakdown.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>TPS</span>
          <span>{cad(cart.breakdown.tps)}</span>
        </div>
        <div className="flex justify-between">
          <span>TVQ</span>
          <span>{cad(cart.breakdown.tvq)}</span>
        </div>
        <div className="flex justify-between">
          <span>Livraison</span>
          {!isLoading ? cad(cart.breakdown.shipping) : <Skeleton className="w-16" />}
        </div>
        <div className="flex justify-between text-lg md:text-xl lg:text-2xl font-semibold mt-2">
          <span>Total</span>
          {!isLoading ? (
            <span>{cad(cart.breakdown.total)}</span>
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
