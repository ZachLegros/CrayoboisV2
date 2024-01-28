"use client";

import ImageWithLoading from "@/components/ImageWithLoading";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { cad } from "@/lib/currencyFormatter";
import { cn } from "@/lib/utils";
import type { Material } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import useAdminStore from "../store";

export default function MaterialsTable(props: { materials: Material[] }) {
  const { materials: materialsFromDb } = props;
  const { materials, setMaterials } = useAdminStore();

  useEffect(() => {
    if (Object.keys(materials).length === 0) setMaterials(materialsFromDb);
  }, [materialsFromDb]);

  const tableRows = useMemo(() => {
    return Object.keys(materials).map((materialId) => (
      <MaterialRow material={materials[materialId]} key={materialId} />
    ));
  }, [materials]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Origine</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Prix</TableHead>
          <TableHead className="text-right max-w-[120px]">
            Quantité disponible
          </TableHead>
          <TableHead className="text-right">Activé</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{tableRows}</TableBody>
    </Table>
  );
}

function MaterialRow(props: { material: Material }) {
  const { material } = props;
  const { toast } = useToast();
  const { updateMaterial } = useAdminStore();
  const router = useRouter();

  const cellStyle = material.enabled ? "opacity-100" : "opacity-40";

  const handleUpdate = useCallback(
    <P extends keyof Material>(property: P, value: Material[P]) => {
      updateMaterial(material, property, value).then((success) => {
        if (!success) {
          toast({
            title: "Une erreur est survenue",
            variant: "destructive",
          });
        }
      });
    },
    [material],
  );

  const handleOnRowClick = useCallback(() => {
    router.push(`/admin/materials/${material.id}`);
  }, [material]);

  return (
    <TableRow
      className="transition-opacity cursor-pointer"
      onClick={handleOnRowClick}
      key={material.id}
    >
      <TableCell className={cellStyle}>
        <ImageWithLoading
          width={100}
          height={100}
          src={material.image}
          alt={material.name}
          className="rounded-md"
        />
      </TableCell>
      <TableCell className={cellStyle}>{material.name}</TableCell>
      <TableCell className={cellStyle}>{material.origin}</TableCell>
      <TableCell className={cellStyle}>{material.type}</TableCell>
      <TableCell className={cellStyle}>{cad(material.price)}</TableCell>
      <TableCell
        className={cn(
          "text-right font-semibold",
          material.quantity > 0 ? "text-green-500" : "text-red-500",
          cellStyle,
        )}
      >
        {material.quantity}
      </TableCell>
      <TableCell className="text-right opacity-100">
        <Switch
          checked={material.enabled}
          onCheckedChange={(checked) => {
            handleUpdate("enabled", checked);
          }}
          onClick={(e) => e.stopPropagation()}
          className="border"
        />
      </TableCell>
    </TableRow>
  );
}
