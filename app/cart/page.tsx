"use client";

import FloatingBar from "@/components/FloatingBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { cad } from "@/lib/currencyFormatter";
import { type ReactNode, useEffect, useMemo } from "react";
import CartBreakdown from "./cart-breakdown";
import CartItem from "./cart-item";
import EmptyCart from "./empty-cart";
import { useCartStore } from "./store";

export default function Cart() {
  const { cart, cartState } = useCartStore();

  const cartItems = useMemo(() => {
    const items: ReactNode[] = [];
    if (cartState.items.length === 0) return [];
    cartState.items
      .slice()
      .reverse()
      .forEach((item, index) => {
        const product = cartState.itemData[item.product.id];
        if (product === undefined) return;
        items.push(
          <div className="flex flex-col gap-4" key={product.id}>
            <CartItem
              item={item}
              product={product}
              hasSeparator={index !== cartState.items.length - 1}
            />
          </div>,
        );
      });
    return items;
  }, [cartState.items]);

  useEffect(() => {
    cart.sync();
  }, []);

  if (cartState.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <Card className="animate-in w-full h-max space-y-4 p-3 dark:bg-background dark:border-none dark:shadow-none">
        {cartItems}
        <Separator className="flex md:hidden" />
        <div className="flex md:hidden justify-between text-xl py-4">
          <span>Sous-total</span>
          <span>{cad(cartState.breakdown.subtotal)}</span>
        </div>
      </Card>
      <div className="hidden md:flex w-full lg:min-w-80 lg:max-w-80 h-max flex-grow sticky top-0 -mt-[calc(4rem+1.5rem+1px)] pt-[calc(1.5rem+2rem+2rem+1px)]">
        <Card className="grid grid-flow-col lg:grid-flow-row gap-2 w-full text-sm p-3 md:text-md lg:text-lg dark:bg-background dark:border-none dark:shadow-none">
          <CartBreakdown />
        </Card>
      </div>
      <FloatingBar className="flex md:hidden">
        <Drawer>
          <DrawerTrigger className="w-full m-3 mb-6" asChild>
            <Button size="lg" className="w-full pointer-events-auto">
              Passer une commande
            </Button>
          </DrawerTrigger>
          <DrawerContent className="mb-3">
            <div className="p-3 flex flex-col">
              <CartBreakdown />
            </div>
          </DrawerContent>
        </Drawer>
      </FloatingBar>
    </>
  );
}
