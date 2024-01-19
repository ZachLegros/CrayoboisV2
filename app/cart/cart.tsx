"use client";

import CartItem from "./cart-item";
import EmptyCart from "./empty-cart";
import CartBreakdown from "./cart-breakdown";
import { ReactNode, useEffect, useMemo } from "react";
import { useCartStore } from "./store";
import { Card } from "@/components/ui/card";
import FloatingBar from "@/components/FloatingBar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cad } from "@/lib/currencyFormatter";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { cart, cartItemData, syncCart, getBreakdown } = useCartStore();
  const { subtotal } = getBreakdown();

  const cartItems = useMemo(() => {
    const items: ReactNode[] = [];
    if (Array.isArray(cart) === false) return [];
    cart
      .slice()
      .reverse()
      .forEach((item, index) => {
        const product = cartItemData[item.product.id];
        if (product === undefined) return;
        items.push(
          <div className="flex flex-col gap-4" key={index}>
            <CartItem
              item={item}
              product={product}
              hasSeparator={index !== cart.length - 1}
            />
          </div>
        );
      });
    return items;
  }, [cart]);

  useEffect(() => {
    syncCart();
  }, []);

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <Card className="animate-in w-full h-max space-y-4 p-3 dark:bg-background dark:border-none dark:shadow-none">
        {cartItems}
        <Separator className="flex md:hidden" />
        <div className="flex md:hidden justify-between text-xl py-4">
          <span>Sous-total</span>
          <span>{cad(subtotal)}</span>
        </div>
      </Card>
      <div className="hidden md:flex min-w-60 max-w-60 lg:min-w-80 lg:max-w-80 h-max flex-grow sticky top-0 -mt-[calc(4rem+1.5rem+1px)] pt-[calc(1.5rem+2rem+2rem+1px)]">
        <Card className="flex flex-col gap-2 w-full text-sm p-3 md:text-md lg:text-lg dark:bg-background dark:border-none dark:shadow-none">
          <CartBreakdown />
        </Card>
      </div>
      <FloatingBar className="flex md:hidden">
        <Drawer>
          <DrawerTrigger className="w-full m-3 mb-6">
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
