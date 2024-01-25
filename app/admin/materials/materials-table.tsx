"use client";

import { useCallback, useEffect, useMemo } from "react";
import type { Material } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cad } from "@/lib/currencyFormatter";
import useAdminStore from "../store";
import ImageWithLoading from "@/components/ImageWithLoading";
import { Switch } from "@/components/ui/switch";
import { updateMaterialInDb } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import EditableField from "@/components/EditableField";

export default function MaterialsTable(props: { materials: Material[] }) {
  const { materials: materialsFromDb } = props;
  const { materials, setMaterials } = useAdminStore();

  useEffect(() => {
    if (materials.length === 0) setMaterials(materialsFromDb);
  }, [materialsFromDb]);

  const tableRows = useMemo(() => {
    return materials.map((material) => (
      <MaterialRow material={material} key={material.id} />
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
          <TableHead className="max-w-[120px]">Quantité disponible</TableHead>
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

  const handleUpdate = useCallback(
    <P extends keyof Material>(property: P, value: Material[P]) => {
      const originalMaterial = { ...material };
      const updatedMaterial = { ...material, [property]: value };
      updateMaterial(updatedMaterial);
      updateMaterialInDb(updatedMaterial).then((updatedMaterial) => {
        if (!updatedMaterial) {
          updateMaterial(originalMaterial);
          toast({ title: "Une erreur est survenue", variant: "destructive" });
        }
      });
    },
    [material]
  );

  return (
    <TableRow key={material.id}>
      <TableCell>
        <ImageWithLoading
          width={100}
          height={100}
          src={material.image}
          alt={material.name}
          className="rounded-md"
        />
      </TableCell>
      <TableCell>
        <EditableField
          type="text"
          value={material.name}
          onChange={(value) => handleUpdate("name", value)}
          className="justify-between"
          multiline
        />
      </TableCell>
      <TableCell>
        <EditableField
          type="text"
          value={material.origin}
          onChange={(value) => handleUpdate("origin", value)}
          inputClassName="w-[150px]"
        />
      </TableCell>
      <TableCell>
        <EditableField
          type="text"
          value={material.type}
          onChange={(value) => handleUpdate("type", value)}
          inputClassName="w-[175px]"
        />
      </TableCell>
      <TableCell>
        <EditableField
          type="number"
          value={`${material.price}`}
          placeholder={`${cad(material.price)}`}
          onChange={(value) => handleUpdate("price", Number(value))}
          inputClassName="max-w-20"
        />
      </TableCell>
      <TableCell>
        <EditableField
          type="number"
          value={`${material.quantity}`}
          onChange={(value) => handleUpdate("quantity", Number(value))}
          className={`font-semibold ${material.quantity > 0 ? "text-green-500" : "text-red-500"}`}
          inputClassName="max-w-20"
        />
      </TableCell>
      <TableCell className="text-right">
        <Switch
          checked={material.enabled}
          onCheckedChange={(value) => handleUpdate("enabled", value)}
        />
      </TableCell>
    </TableRow>
  );
}
