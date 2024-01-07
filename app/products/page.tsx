import prisma from "@/lib/prisma";
import ProductsGrid from "./products";

export default async function ProductsPage() {
  const products = await prisma.product.findMany();

  return <ProductsGrid products={products} />;
}
