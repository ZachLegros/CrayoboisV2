"use client";

import CartItem from "./cart-item";
import EmptyCart from "./empty-cart";
import CartBreakdown from "./cart-breakdown";
import { useEffect } from "react";
import { useCartStore } from "./store";
import { Card } from "@/components/ui/card";
import FloatingBar from "@/components/FloatingBar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cad } from "@/utils/currencyFormatter";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { cart, syncCart, getBreakdown } = useCartStore();
  const { subtotal } = getBreakdown();

  useEffect(() => {
    syncCart();
  }, []);

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <Card className="animate-in w-full h-max space-y-4 dark:bg-background dark:border-none dark:shadow-none">
        {cart.toReversed().map((item, index) => (
          <div className="flex flex-col gap-4" key={index}>
            <CartItem item={item} hasSeparator={index !== cart.length - 1} />
          </div>
        ))}
        <Separator className="flex md:hidden" />
        <div className="flex md:hidden justify-between text-xl py-4">
          <span>Sous-total</span>
          <span>{cad(subtotal)}</span>
        </div>
      </Card>
      <div className="hidden md:flex min-w-60 max-w-60 lg:min-w-80 lg:max-w-80 h-max flex-grow sticky top-0 -mt-[calc(4rem+1.5rem+1px)] pt-[calc(1.5rem+2rem+2rem+1px)]">
        <CartBreakdown />
      </div>
      <FloatingBar className="flex md:hidden">
        <Drawer>
          <DrawerTrigger className="w-full m-3 mb-6">
            <Button size="lg" className="w-full pointer-events-auto">
              Passer une commande
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <CartBreakdown className="p-3 mb-3" />
          </DrawerContent>
        </Drawer>
      </FloatingBar>
    </>
  );
}
