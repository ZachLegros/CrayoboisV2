"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import { useCartStore } from "../cart/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
  const router = useRouter();
  const { cart, syncCart } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/api/checkout_sessions", {
      method: "POST",
      body: JSON.stringify(cart),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status === 200) {
          setClientSecret(data.clientSecret);
        } else {
          if (data.error === "cart_is_empty") {
            toast.error("Votre panier est vide.");
            router.push("/cart");
          } else if (data.error === "cart_out_of_sync") {
            syncCart();
            toast.error("Un ou plusieurs produits de votre panier ne sont plus disponibles.");
            router.push("/cart");
          } else {
            toast.error("Une erreur inattendu est survenue. Veuillez réessayer ou nous contacter.");
            console.log(data.error);
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Card id="checkout" className="animate-in max-w-screen-sm mx-auto relative">
      <CardBody className={clientSecret ? "h-auto" : "flex justify-center items-center h-[650px]"}>
        {clientSecret ? (
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
