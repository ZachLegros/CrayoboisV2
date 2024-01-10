import NextLink from "next/link";
import { useCustomOrderStore } from "./store";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AddedToCart() {
  const { reset } = useCustomOrderStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full mt-8">
      <p className="text-3xl font-bold">
        Votre produit a été ajouté au{" "}
        <Button variant="link" className="text-3xl font-bold p-0 underline" onClick={() => reset()}>
          <NextLink href="/cart">panier</NextLink>
        </Button>
      </p>
      <Button color="primary" className="mt-8 font-semibold" onClick={() => reset()}>
        Créer un autre produit
      </Button>
    </div>
  );
}
