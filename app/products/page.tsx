import prisma from "@/lib/prisma";
import ProductsGrid from "./products";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { quantity: { gt: 0 } },
  });

  return <ProductsGrid products={products} />;
}
