"use client";

import EditableField from "@/components/EditableField";
import Field from "@/components/Field";
import ImageWithLoading from "@/components/ImageWithLoading";
import { useToast } from "@/components/ui/use-toast";
import { cad } from "@/lib/currencyFormatter";
import { cn } from "@/lib/utils";
import type { Product } from "@prisma/client";
import { useCallback, useEffect } from "react";
import useAdminStore from "../../store";
import { getProducts } from "../actions";

export default function ProductDetails(props: { productId: string }) {
  const { productId } = props;
  const { products, setProducts, updateProduct } = useAdminStore();
  const product = products[productId] ?? null;

  const { toast } = useToast();

  const errorToast = useCallback(
    () =>
      toast({
        title: "Une erreur est survenue",
        variant: "destructive",
      }),
    [toast],
  );

  const handleUpdate = useCallback(
    async <P extends keyof Product>(
      property: P,
      value: Product[P],
    ): Promise<void> => {
      if (!product) {
        errorToast();
      }
      const success = await updateProduct(product.id, property, value);
      if (!success) {
        errorToast();
      }
    },
    [product, errorToast, updateProduct],
  );

  useEffect(() => {
    if (!product) getProducts().then((products) => setProducts(products));
  }, [product, setProducts]);

  if (!product) return null;

  return (
    <div>
      <div className="text-lg md:text-xl mb-3">
        <Field label="Nom">
          <EditableField
            value={product.name}
            onChange={(value) => handleUpdate("name", value)}
          />
        </Field>
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="sm:size-[200px] md:size-[250px]">
          <ImageWithLoading
            src={product.image}
            width={250}
            height={250}
            alt={product.name}
            quality={100}
            className="rounded-lg w-full object-contain sm:max-w-[200px] md:max-w-[250px]"
          />
        </div>
        <div className="flex-auto">
          <Field label="Prix">
            <EditableField
              placeholder={cad(product.price)}
              value={`${product.price}`}
              onChange={(value) => handleUpdate("price", Number(value))}
              type="number"
            />
          </Field>
          <Field label="Quantité">
            <EditableField
              placeholder={`${product.quantity}`}
              value={`${product.quantity}`}
              onChange={(value) => handleUpdate("quantity", Number(value))}
              type="number"
              className={cn(
                "font-semibold",
                product.quantity > 0 ? "text-foreground" : "text-red-500",
              )}
            />
          </Field>
          <Field
            label="Description"
            className={cn(
              "items-start h-max w-full",
              product.description !== null ? "block" : "inline-flex",
            )}
          >
            <EditableField
              value={product.description ?? ""}
              onChange={(value) => handleUpdate("description", value)}
              className="w-full max-w-[450px]"
              inputClassName="min-h-20 max-w-[450px] w-full"
              multiline
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
