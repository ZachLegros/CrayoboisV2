"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@prisma/client";
import snakeCase from "lodash.snakecase";
import { cookies } from "next/headers";
import { v4 } from "uuid";
import { uploadImage } from "../actions";

export async function getProducts(): Promise<Product[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";

  if (isAdmin) {
    return await prisma.product.findMany();
  }
  return [];
}

export async function updateProductInDb(product: Product) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";

  if (isAdmin) {
    await prisma.product.update({
      where: { id: product.id },
      data: { ...product },
    });
    return true;
  }
  return false;
}

export async function addNewProduct({
  name,
  price,
  quantity,
  image,
  description,
}: {
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
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
      "products",
      `${snakeCase(name)}_${v4()}.jpg`,
      {
        width: 1024,
        height: 1024,
        fit: "cover",
      },
    );
    if (!data) throw new Error("Error uploading image");

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${data.path}`;

    console.log("New product image url:", url);

    await prisma.product.create({
      data: {
        name,
        price: parseFloat(price.toFixed(2)),
        quantity: quantity,
        description,
        image: url,
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
