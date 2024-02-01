export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import ProductsTable from "./products-table";

export default async function AdminProducts() {
  const products = await prisma.product.findMany();

  return (
    <div className="md:p-3 md:border rounded-xl">
      <ProductsTable products={products} />
    </div>
  );
}
