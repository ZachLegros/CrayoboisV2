"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { Material } from "@prisma/client";
import snakeCase from "lodash.snakecase";
import { cookies } from "next/headers";
import { v4 } from "uuid";
import { uploadImage } from "../actions";

export async function getMaterials(): Promise<Material[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";

  if (isAdmin) {
    return await prisma.material.findMany();
  }
  return [];
}

export async function updateMaterialInDb(material: Material) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";

  if (isAdmin) {
    await prisma.material.update({
      where: { id: material.id },
      data: { ...material },
    });
    return true;
  }
  return false;
}

export async function addNewMaterial({
  name,
  price,
  quantity,
  image,
  origin,
  type,
}: {
  name: string;
  price: number;
  quantity: number;
  image: string;
  origin: string;
  type: string;
}) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const isAdmin = session?.user.user_metadata.role === "admin";
    if (!isAdmin) throw new Error("Not admin");

    const data = await uploadImage(
      image,
      "inventory",
      `materials/${snakeCase(name)}_${v4()}.jpg`,
      { width: 256, height: 256, fit: "cover" },
    );
    if (!data) throw new Error("Error uploading image");

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/inventory/${data.path}`;

    console.log("New material image url:", url);

    await prisma.material.create({
      data: {
        name,
        price: parseFloat(price.toFixed(2)),
        quantity: quantity,
        origin,
        type,
        nature: "bois",
        image: url,
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
