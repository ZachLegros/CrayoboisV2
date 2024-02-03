"use server";

import { createClient } from "@/lib/supabase/server";
import { createNoCookiesClient } from "@/lib/supabase/serverNoCookies";
import { cookies } from "next/headers";
import sharp, { type ResizeOptions } from "sharp";

export async function uploadImage(
  base64JpgImg: string,
  bucketId: string,
  storagePath: string,
  resizeOptions: ResizeOptions,
) {
  try {
    const cookieStore = cookies();
    let supabase = createClient(cookieStore);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const isAdmin = session?.user.user_metadata.role === "admin";
    if (!isAdmin) throw new Error("Not admin");

    supabase = createNoCookiesClient();

    const imageWithoutB64Header = base64JpgImg.split(";base64,").pop() as string;

    const binaryImage = Buffer.from(imageWithoutB64Header, "base64");
    // resize image
    const jpg = await sharp(binaryImage)
      .resize(resizeOptions)
      .jpeg({ quality: 75 })
      .toBuffer();

    const { data, error } = await supabase.storage
      .from(bucketId)
      .upload(storagePath, jpg, {
        upsert: true,
        contentType: "image/jpg",
      });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error uploading image", error);
    return null;
  }
}
