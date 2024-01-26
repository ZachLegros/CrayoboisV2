"use client";

import { useCallback, useEffect } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Material } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
// import { useRouter } from "next/navigation";
import ImageWithLoading from "@/components/ImageWithLoading";
import { cad } from "@/lib/currencyFormatter";
import useAdminStore from "../../store";
import { getMaterials } from "../actions";

export default function MaterialDetails(props: { materialId: string }) {
  const { materialId } = props;
  const { materials, setMaterials, updateMaterial } = useAdminStore();
  const material = materials[materialId] ?? null;

  const { toast } = useToast();
  // const router = useRouter();
  const cellStyle = material?.enabled ? "opacity-100" : "opacity-40";

  const errorToast = useCallback(
    () =>
      toast({
        title: "Une erreur est survenue",
        variant: "destructive",
      }),
    [toast]
  );

  const handleUpdate = useCallback(
    async <P extends keyof Material>(
      property: P,
      value: Material[P]
    ): Promise<void> => {
      if (!material) {
        errorToast();
      }
      const success = await updateMaterial(material, property, value);
      if (!success) {
        errorToast();
      }
    },
    [material, errorToast]
  );

  useEffect(() => {
    if (!material) getMaterials().then((materials) => setMaterials(materials));
  }, [material]);

  if (!material) return null;

  return (
    <TableRow className={cellStyle}>
      <TableCell>
        <ImageWithLoading
          src={material.image}
          alt={material.name}
          width={100}
          height={100}
        />
      </TableCell>
      <TableCell>{material.name}</TableCell>
      <TableCell>{material.origin}</TableCell>
      <TableCell>{material.type}</TableCell>
      <TableCell>{cad(material.price)}</TableCell>
      <TableCell>{material.quantity}</TableCell>
      <TableCell className="text-right">
        <Switch
          checked={material.enabled}
          onCheckedChange={(value) => {
            handleUpdate("enabled", value);
          }}
          onClick={(e) => e.stopPropagation()}
          className="border"
        />
      </TableCell>
    </TableRow>
  );
}
