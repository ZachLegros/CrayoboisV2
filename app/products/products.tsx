"use client";

import ItemsGrid from "@/components/ItemsGrid";
import ProductCard from "@/components/ProductCard";
import { NonNullabbleProduct } from "@/utils/customProductFactory";
import { Product } from "@prisma/client";

export default function ProductsGrid(props: { products: Product[] }) {
  const { products } = props;

  return (
    <ItemsGrid className="lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product as NonNullabbleProduct} onClick={() => {}} />
      ))}
    </ItemsGrid>
  );
}
