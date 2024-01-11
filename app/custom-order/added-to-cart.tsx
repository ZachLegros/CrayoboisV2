import { useCustomOrderStore } from "./store";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddedToCart() {
  const router = useRouter();
  const { reset } = useCustomOrderStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full mt-8">
      <p className="text-3xl font-bold">Votre produit a été ajouté au panier.</p>
      <div className="flex mt-8 gap-4 items-center">
        <Button variant="outline" onClick={() => reset()}>
          Créer un autre produit
        </Button>{" "}
        ou
        <Button
          variant="default"
          onClick={() => {
            router.push("/cart");
            reset();
          }}
        >
          Aller au panier
        </Button>
      </div>
    </div>
  );
}
