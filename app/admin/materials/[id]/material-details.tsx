"use client";

import EditableField from "@/components/EditableField";
import Field from "@/components/Field";
import ImageWithLoading from "@/components/ImageWithLoading";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { cad } from "@/lib/currencyFormatter";
import { cn } from "@/lib/utils";
import type { Material } from "@prisma/client";
import { useCallback, useEffect } from "react";
import useAdminStore from "../../store";
import { getMaterials } from "../actions";

export default function MaterialDetails(props: { materialId: string }) {
  const { materialId } = props;
  const { materials, setMaterials, updateMaterial } = useAdminStore();
  const material = materials[materialId] ?? null;

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
    async <P extends keyof Material>(
      property: P,
      value: Material[P],
    ): Promise<void> => {
      if (!material) {
        errorToast();
      }
      const success = await updateMaterial(material, property, value);
      if (!success) {
        errorToast();
      }
    },
    [material, errorToast, updateMaterial],
  );

  useEffect(() => {
    if (!material) getMaterials().then((materials) => setMaterials(materials));
  }, [material, setMaterials]);

  if (!material) return null;

  return (
    <div>
      <div className="text-lg md:text-xl mb-3">
        <Field label="Nom">
          <EditableField
            value={material.name}
            onChange={(value) => handleUpdate("name", value)}
          />
        </Field>
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        <ImageWithLoading
          src={material.image}
          width={250}
          height={250}
          alt={material.name}
          quality={100}
          className="rounded-lg w-full object-contain sm:w-[200px] sm:h-[200px] md:w-[175px] md:h-[175px]"
        />
        <div className="flex-auto">
          <Field label="Activé">
            <Switch
              checked={material.enabled}
              onCheckedChange={(checked) => handleUpdate("enabled", checked)}
              className="w-9"
            />
          </Field>
          <Field label="Prix">
            <EditableField
              placeholder={cad(material.price)}
              value={`${material.price}`}
              onChange={(value) => handleUpdate("price", Number(value))}
              type="number"
            />
          </Field>
          <Field label="Quantité">
            <EditableField
              placeholder={`${material.quantity}`}
              value={`${material.quantity}`}
              onChange={(value) => handleUpdate("quantity", Number(value))}
              type="number"
              className={cn(
                "font-semibold",
                material.quantity > 0 ? "text-green-500" : "text-red-500",
              )}
            />
          </Field>
          <Field label="Type">
            <EditableField
              value={material.type}
              onChange={(value) => handleUpdate("type", value)}
            />
          </Field>
          <Field label="Origine">
            <EditableField
              value={material.origin}
              onChange={(value) => handleUpdate("origin", value)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
