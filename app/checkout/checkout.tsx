"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import { useCartStore } from "../cart/store";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, syncCart } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (cart.length > 0 && !sessionId && !clientSecret) {
      fetch("/api/checkout_sessions", {
        method: "POST",
        body: JSON.stringify(cart),
        credentials: "same-origin",
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.status === 200) {
            setClientSecret(data.clientSecret);
          } else {
            if (data.error === "cart_is_empty") {
              toast.error("Votre panier est vide.");
            } else if (data.error === "cart_out_of_sync") {
              syncCart();
              toast.error("Un ou plusieurs produits de votre panier ne sont plus disponibles.");
            } else {
              toast.error(
                "Une erreur inattendu est survenue. Veuillez réessayer ou nous contacter."
              );
              console.log(data.error);
            }
            router.push("/cart");
          }
        })
        .catch((err) => console.log(err));
    } else if (sessionId) {
      fetch(`/api/checkout_sessions?session_id=${sessionId}`, {
        method: "GET",
      }).then(async (res) => {
        const data = await res.json();
        console.log(data);
      });
    } else if (cart.length === 0) {
      router.push("/cart");
    }
  }, []);

  return (
    <Card id="checkout" className="animate-in max-w-screen-sm mx-auto relative">
      <CardBody className={clientSecret ? "h-auto" : "flex justify-center items-center h-[650px]"}>
        {sessionId ? (
          <></>
        ) : clientSecret ? (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckout className="rounded-lg overflow-hidden" />
          </EmbeddedCheckoutProvider>
        ) : (
          <div className="flex flex-col w-full h-full justify-center items-center gap-4">
            <p className="text-xl md:text-2xl font-semibold text-center">
              Création d'une session de paiement sécurisée...
            </p>
            <Spinner size="lg" />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
