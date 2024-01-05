"use client";

import ItemsGrid from "@/components/ItemsGrid";
import ProductCard from "@/components/ProductCard";
import { NonNullabbleProduct } from "@/utils/customProductFactory";
import { Button } from "@nextui-org/react";
import { Product } from "@prisma/client";
import { useEffect } from "react";
import { useProductsStore } from "./store";
import { useRouter } from "next/navigation";

export default function ProductsGrid(props: { products: Product[] }) {
  const { products } = props;
  const router = useRouter();
  const { setProducts } = useProductsStore();

  useEffect(() => {
    setProducts(products);
  }, []);

  if (products.length === 0)
    return (
      <div className="flex flex-col items-center justify-start w-full h-full mt-8">
        <p className="text-3xl font-bold">Tous nos produits préfabriqués sont vendus!</p>
        <Button
          color="primary"
          className="mt-8"
          size="lg"
          onClick={() => router.push("/custom-order")}
        >
          Commander un produit sur mesure
        </Button>
      </div>
    );

  return (
    <ItemsGrid className="lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product as NonNullabbleProduct} onClick={() => {}} />
      ))}
    </ItemsGrid>
  );
}
