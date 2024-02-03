"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createNoCookiesClient } from "@/lib/supabase/serverNoCookies";
import type { Hardware } from "@prisma/client";
import snakeCase from "lodash.snakecase";
import { cookies } from "next/headers";
import sharp from "sharp";
import { v4 } from "uuid";

export async function getHardwares(): Promise<Hardware[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";

  if (isAdmin) {
    return await prisma.hardware.findMany();
  }
  return [];
}

export async function updateHardwareInDb(hardware: Hardware) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.user_metadata.role === "admin";

  if (isAdmin) {
    await prisma.hardware.update({
      where: { id: hardware.id },
      data: { ...hardware },
    });
    return true;
  }
  return false;
}

export async function addNewHardware({
  name,
  price,
  quantity,
  image,
  color,
}: {
  name: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
}) {
  try {
    const cookieStore = cookies();
    let supabase = createClient(cookieStore);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const isAdmin = session?.user.user_metadata.role === "admin";
    if (!isAdmin) throw new Error("Not admin");

    const binaryImage = Buffer.from(image, "base64");
    // resize image
    const jpg = await sharp(binaryImage)
      .resize({ width: 256, height: 256, fit: "cover" })
      .jpeg({ quality: 75 })
      .toBuffer();

    // create client with service role
    supabase = createNoCookiesClient();
    // upload image to supabase
    const { data, error } = await supabase.storage
      .from("inventory")
      .upload(`hardwares/${snakeCase(name)}_${v4()}.jpg`, jpg, {
        upsert: true,
        contentType: "image/jpg",
      });

    if (error) {
      throw error;
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/inventory/${data.path}`;

    console.log("New hardware image url:", url);

    await prisma.hardware.create({
      data: {
        name,
        price: parseFloat(price.toFixed(2)),
        quantity,
        color,
        image: url,
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
