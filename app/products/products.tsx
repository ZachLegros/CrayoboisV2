"use client";

import ItemsGrid from "@/components/ItemsGrid";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import type { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useProductsStore } from "./store";

export default function ProductsGrid(props: { products: Product[] }) {
  const { products: productsFromDb } = props;
  const router = useRouter();
  const { priceFilter, products, setProducts } = useProductsStore();

  useEffect(() => {
    if (products.length === 0) setProducts(productsFromDb);
  }, [products, productsFromDb, setProducts]);

  const filteredProducts = useMemo(() => {
    if (products.length === 0) return [];
    const prods = [...products];
    if (priceFilter.enabled) {
      prods.sort((a, b) => {
        if (priceFilter.value === "asc") return a.price - b.price;
        if (priceFilter.value === "desc") return b.price - a.price;
        return 0;
      });
    }
    return prods;
  }, [products, priceFilter]);

  if (filteredProducts.length === 0)
    return (
      <div className="flex flex-col items-center justify-start w-full h-full mt-8">
        <p className="text-3xl text-center font-bold p-3">
          Tous nos produits préfabriqués sont vendus!
        </p>
        <Button
          className="mt-8 font-semibold"
          onClick={() => router.push("/custom-order")}
        >
          Commander un produit sur mesure
        </Button>
      </div>
    );

  return (
    <ItemsGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} onClick={() => {}} />
      ))}
    </ItemsGrid>
  );
}
