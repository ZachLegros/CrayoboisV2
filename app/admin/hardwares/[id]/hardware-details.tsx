"use client";

import EditableField from "@/components/EditableField";
import Field from "@/components/Field";
import ImageInput from "@/components/ImageInput";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { cad } from "@/lib/currencyFormatter";
import { cn } from "@/lib/utils";
import type { Hardware } from "@prisma/client";
import snakeCase from "lodash.snakecase";
import { useCallback, useEffect } from "react";
import { v4 } from "uuid";
import { uploadImage } from "../../actions";
import useAdminStore from "../../store";
import { getHardwares } from "../actions";

export default function HardwareDetails(props: { hardwareId: string }) {
  const { hardwareId } = props;
  const { hardwares, setHardwares, updateHardware } = useAdminStore();
  const hardware = hardwares[hardwareId] ?? null;

  const { toast } = useToast();

  const errorToast = useCallback(
    () =>
      toast({
        title: "Une erreur est survenue.",
        variant: "destructive",
      }),
    [toast],
  );

  const successToast = useCallback(
    () =>
      toast({
        title: "Le matériel a été mis à jour avec succès.",
        variant: "success",
      }),
    [toast],
  );

  const handleUpdate = useCallback(
    async <P extends keyof Hardware>(
      property: P,
      value: Hardware[P],
    ): Promise<void> => {
      if (!hardware) {
        errorToast();
      }
      const success = await updateHardware(hardware.id, property, value);
      if (!success) {
        errorToast();
      }
    },
    [hardware, errorToast, updateHardware],
  );

  const handleUpdateImage = useCallback(
    async (image: string) => {
      if (!hardware) {
        errorToast();
      }
      // upload image
      const url = await uploadImage(
        image,
        "inventory",
        `hardwares/${snakeCase(hardware.name)}_${v4()}.jpg`,
        { width: 500, height: 500, fit: "cover" },
      );
      if (!url) {
        errorToast();
        return;
      }
      const success = await updateHardware(hardware.id, "image", url);
      if (!success) {
        errorToast();
      }
      successToast();
    },
    [hardware, errorToast, updateHardware],
  );

  useEffect(() => {
    if (!hardware) getHardwares().then((hardwares) => setHardwares(hardwares));
  }, [hardware, setHardwares]);

  if (!hardware) return null;

  return (
    <div>
      <div className="text-lg md:text-xl mb-3">
        <Field label="Nom">
          <EditableField
            value={hardware.name}
            onChange={(value) => handleUpdate("name", value)}
          />
        </Field>
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        <ImageInput
          defaultImage={hardware.image}
          onChange={handleUpdateImage}
          className="rounded-lg w-full object-contain sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px]"
        />
        <div className="flex-auto">
          <Field label="Activé">
            <Switch
              checked={hardware.enabled}
              onCheckedChange={(checked) => handleUpdate("enabled", checked)}
              className="w-9"
            />
          </Field>
          <Field label="Prix">
            <EditableField
              placeholder={cad(hardware.price)}
              value={`${hardware.price}`}
              onChange={(value) => handleUpdate("price", Number(value))}
              type="number"
            />
          </Field>
          <Field label="Quantité">
            <EditableField
              placeholder={`${hardware.quantity}`}
              value={`${hardware.quantity}`}
              onChange={(value) => handleUpdate("quantity", Number(value))}
              type="number"
              className={cn(
                "font-semibold",
                hardware.quantity > 0 ? "text-foreground" : "text-red-500",
              )}
            />
          </Field>
          <Field label="Couleur">
            <EditableField
              placeholder={`${hardware.color}`}
              value={hardware.color}
              onChange={(value) => handleUpdate("color", value)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
