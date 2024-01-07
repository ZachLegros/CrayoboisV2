"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import { useCartStore } from "../cart/store";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
  const { cart } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/api/checkout_sessions", {
      method: "POST",
      body: JSON.stringify(cart),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  return (
    <Card id="checkout" className="animate-in max-w-screen-sm mx-auto relative">
      <CardBody className={clientSecret ? "h-auto" : "flex justify-center items-center h-[650px]"}>
        {clientSecret ? (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckout className="rounded-lg overflow-hidden" />
          </EmbeddedCheckoutProvider>
        ) : (
          <Spinner size="lg" />
        )}
      </CardBody>
    </Card>
  );
}
