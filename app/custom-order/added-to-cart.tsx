import { useCustomOrderStore } from "./store";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddedToCart() {
  const router = useRouter();
  const { reset } = useCustomOrderStore();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full mt-11">
      <div className="flex flex-col">
        <p className="text-2xl lg:text-3xl font-bold text-center">
          Votre produit a été ajouté au panier.
        </p>
        <div className="flex mt-8 gap-4 justify-center items-center flex-wrap">
          <Button variant="outline" onClick={() => reset()}>
            Créer un autre produit
          </Button>
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
      {/* {isOpen && (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
          <DrawerContent className="flex md:hidden h-52 p-3 space-y-4">
            <div className="flex flex-col w-full h-full text-center">
              <p className="text-xl font-bold">
                Votre produit a été ajouté au panier.
              </p>
              <div className="flex mt-8 gap-4 justify-center items-center flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => {
                    reset();
                    onOpenChange(false);
                  }}
                >
                  Créer un autre produit
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    router.push("/cart");
                    reset();
                    onOpenChange(false);
                  }}
                >
                  Aller au panier
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )} */}
    </div>
  );
}
