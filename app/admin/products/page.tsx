export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { FaPlus } from "react-icons/fa";
import CreateProduct from "./create-product";
import ProductsTable from "./products-table";

export default async function AdminProducts() {
  const products = await prisma.product.findMany();

  return (
    <div className="flex flex-col flex-auto max-w-full gap-3">
      <CreateProduct>
        <Button className="ml-auto">
          Ajouter un produit
          <FaPlus className="ml-1" />
        </Button>
      </CreateProduct>
      <div className="flex-auto h-0 overflow-auto">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}
