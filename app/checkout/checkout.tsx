"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "../cart/store";
import { FaCircleCheck } from "react-icons/fa6";
import { FaExclamationCircle } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const destroyCheckoutSession = async (sessionIdSearchParam?: string) => {
  // Destroy checkout session
  const storedSessionId = localStorage.getItem("checkout_session_id");
  if (sessionIdSearchParam === undefined && storedSessionId) {
    fetch(`/api/checkout_sessions?session_id=${storedSessionId}`, {
      method: "DELETE",
    }).then(() => localStorage.removeItem("checkout_session_id"));
  }
};

export default function Checkout(props: { sessionId?: string }) {
  const { sessionId } = props;
  const router = useRouter();
  const { toast } = useToast();
  const { cart, syncCart, shippingMethod, clearCart } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleErrors = (error: string) => {
      if (error === "cart_is_empty") {
        toast({ title: "Votre panier est vide." });
      } else if (error === "cart_out_of_sync") {
        syncCart();
        toast({
          title:
            "Un ou plusieurs produits de votre panier ne sont plus disponibles.",
          variant: "destructive",
        });
      } else {
        toast({
          title:
            "Une erreur inattendu est survenue. Veuillez réessayer ou nous contacter.",
          variant: "destructive",
        });
        console.error(error);
      }
    };

    // Clean up last checkout session if any
    destroyCheckoutSession(sessionId);

    const fetchCheckoutSessions = async () => {
      try {
        if (cart.length > 0 && shippingMethod && !sessionId && !clientSecret) {
          const res = await fetch("/api/checkout_sessions", {
            method: "POST",
            body: JSON.stringify({ cart, shippingId: shippingMethod.id }),
            credentials: "same-origin",
          });
          const data = await res.json();
          if (res.status === 200) {
            setClientSecret(data.clientSecret);
            localStorage.setItem("checkout_session_id", data.sessionId);
          } else {
            // cart out of sync or empty
            handleErrors(data.error);
            router.push("/cart");
          }
        } else if (sessionId) {
          const res = await fetch(`/api/checkout_sessions?session_id=${sessionId}`, {
            method: "GET",
          });
          const data = await res.json();
          if (data.status === "complete") {
            clearCart();
            setSuccess(true);
          } else {
            // transaction failed or unexpected error
            setError(true);
          }
        } else {
          // cart is empty or shipping method is undefined
          router.push("/cart");
        }
      } catch (err: any) {
        handleErrors(err.message);
        console.error(err);
        router.push("/cart");
      }
    };

    fetchCheckoutSessions();

    return () => {
      destroyCheckoutSession(sessionId);
    };
  }, []);

  return (
    <Card
      id="checkout"
      className={`animate-in max-w-screen-sm mx-auto relative p-3 min-h-[650px] ${
        !clientSecret && "flex justify-center items-center"
      }`}
    >
      {sessionId ? (
        success ? (
          <div className="animate-in flex flex-col w-full h-full justify-center items-center gap-2 p-4">
            <p className="text-xl md:text-2xl font-semibold text-center">
              Merci de supporter Crayobois!
            </p>
            <p className="text-lg md:text-xl text-foreground/60 font-semibold text-center">
              Vous recevrez un email de confirmation à l'adresse courriel fournie.
            </p>
            <FaCircleCheck className="text-6xl text-green-500 mt-4" />
          </div>
        ) : error ? (
          <div className="animate-in flex flex-col w-full h-full justify-center items-center gap-2 p-4">
            <p className="text-xl md:text-2xl font-semibold text-center">
              Une erreur est survenue.
            </p>
            <p className="text-lg md:text-xl text-foreground/60 font-semibold text-center">
              Veuillez réessayer ou nous{" "}
              <Button
                variant="link"
                className="text-lg md:text-xl font-semibold p-0 underline"
              >
                <NextLink href="/contact">contacter</NextLink>
              </Button>{" "}
              afin de nous faire part du problème rencontré.
            </p>
            <FaExclamationCircle className="text-6xl text-primary mt-4" />
          </div>
        ) : (
          <Spinner className="text-primary w-10 h-10" />
        )
      ) : clientSecret ? (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
          <EmbeddedCheckout className="animate-in rounded-lg overflow-hidden" />
        </EmbeddedCheckoutProvider>
      ) : (
        <div className="flex flex-col w-full h-full justify-center items-center gap-4">
          <p className="text-xl md:text-2xl font-semibold text-center">
            Création d'une session de paiement sécurisée...
          </p>
          <Spinner className="text-primary w-10 h-10" />
        </div>
      )}
    </Card>
  );
}
