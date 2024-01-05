import prisma from "@/lib/prisma";
import ProductsGrid from "./products";

export default async function Products() {
  const products = await prisma.product.findMany({ where: { is_custom: false } });

  return <ProductsGrid products={products} />;
}
