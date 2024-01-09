import { Button, Link } from "@nextui-org/react";
import NextLink from "next/link";
import { useCustomOrderStore } from "./store";
import { useEffect } from "react";

export default function AddedToCart() {
  const { reset } = useCustomOrderStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full mt-8">
      <p className="text-3xl font-bold">
        Votre produit a été ajouté au{" "}
        <Link
          as={NextLink}
          href="/cart"
          className="text-3xl font-bold cursor-pointer"
          color="primary"
          underline="hover"
          onClick={() => reset()}
        >
          panier
        </Link>
      </p>
      <Button color="primary" className="mt-8 font-semibold" size="md" onClick={() => reset()}>
        Créer un autre produit
      </Button>
    </div>
  );
}
