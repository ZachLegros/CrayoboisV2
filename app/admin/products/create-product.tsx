"use client";

import ImageInput from "@/components/ImageInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useAdminStore from "../store";
import { addNewProduct, getProducts } from "./actions";

type FormValues = {
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CreateProduct(props: { children: React.ReactNode }) {
  const { children } = props;
  const { toast } = useToast();
  const { setProducts } = useAdminStore();
  const { reset, resetField, setValue, control, handleSubmit, formState } =
    useForm<FormValues>({
      defaultValues: {
        name: "",
        description: "",
        price: 0,
        image: "",
        quantity: 0,
      },
    });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const success = await addNewProduct({ ...data });
      if (success) {
        setOpen(false);
        reset();
        getProducts().then((products) => setProducts(products));
        toast({ title: "Produit ajouté avec succès.", variant: "success" });
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur lors de l'ajout du produit.",
        variant: "destructive",
      });
    }
    setLoading(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-xl font-semibold">
          Ajouter un produit
        </DialogHeader>
        <DialogDescription>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-auto">
                <Controller
                  name="image"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <ImageInput
                      {...field}
                      onClear={() => resetField("image")}
                      onChange={(image) => {
                        setValue("image", image, { shouldValidate: true });
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input {...field} placeholder="Nom" />
                    </div>
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div>
                      <Label htmlFor="color">Description</Label>
                      <textarea
                        {...field}
                        className="bg-transparent text-foreground border rounded-md p-1 min-h-20 w-full"
                        placeholder="Ce stylo magnifique..."
                      />
                    </div>
                  )}
                />
                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) => value >= 0,
                    onChange: (e) => {
                      setValue("price", parseFloat(e.target.value));
                    },
                  }}
                  render={({ field }) => (
                    <div>
                      <Label htmlFor="price">Prix</Label>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Prix"
                        min={0}
                        step={0.01}
                      />
                    </div>
                  )}
                />
                <Controller
                  name="quantity"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) => value >= 0,
                    onChange: (e) => {
                      setValue("quantity", parseInt(e.target.value));
                    },
                  }}
                  render={({ field }) => (
                    <div>
                      <Label htmlFor="quantity">Quantité</Label>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Quantité"
                        min={0}
                        step={1}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="flex h-max w-max items-center ml-auto mt-3">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="mr-2">
                  Annuler
                </Button>
              </DialogClose>
              <Button
                type="submit"
                isLoading={loading}
                disabled={!formState.isValid || loading}
              >
                Ajouter
              </Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
