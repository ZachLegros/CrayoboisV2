"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Card, CardBody, Link, Spinner } from "@nextui-org/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "../cart/store";
import { FaCircleCheck } from "react-icons/fa6";
import { FaExclamationCircle } from "react-icons/fa";

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
  const { cart, syncCart, shippingMethod, clearCart } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleErrors = (data: { error: string }) => {
      if (data.error === "cart_is_empty") {
        toast.error("Votre panier est vide.");
      } else if (data.error === "cart_out_of_sync") {
        syncCart();
        toast.error("Un ou plusieurs produits de votre panier ne sont plus disponibles.");
      } else {
        toast.error("Une erreur inattendu est survenue. Veuillez réessayer ou nous contacter.");
        console.log(data.error);
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
            handleErrors(data);
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
            setError(true);
          }
          console.log(data);
        } else {
          router.push("/cart");
        }
      } catch (err) {
        toast.error(
          "Une erreur inattendu est survenue. Veuillez réessayer et nous contacter si le problème persiste."
        );
        console.log(err);
        router.push("/cart");
      }
    };

    fetchCheckoutSessions();

    return () => {
      destroyCheckoutSession();
    };
  }, []);

  return (
    <Card id="checkout" className="animate-in max-w-screen-sm mx-auto relative">
      <CardBody className={clientSecret ? "h-auto" : "flex justify-center items-center h-[650px]"}>
        {sessionId ? (
          success ? (
            <div className="animate-in flex flex-col w-full h-full justify-center items-center gap-2 p-4">
              <p className="text-xl md:text-2xl font-semibold text-center">
                Merci de supporter Crayobois!
              </p>
              <p className="text-lg md:text-xl text-foreground/60 font-semibold text-center">
                Vous recevrez un email de confirmation à l'adresse fournie.
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
                <Link
                  as={NextLink}
                  href="/contact"
                  color="primary"
                  className="text-lg md:text-xl font-semibold"
                  underline="hover"
                >
                  contacter
                </Link>{" "}
                afin de nous faire part du problème rencontré.
              </p>
              <FaExclamationCircle className="text-6xl text-primary mt-4" />
            </div>
          ) : (
            <Spinner size="lg" />
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
            <Spinner size="lg" />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
