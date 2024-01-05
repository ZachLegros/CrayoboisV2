import prisma from "../lib/prisma";
import { SupabaseClient } from "@supabase/supabase-js";
import { sequentialAsyncOperations, toSnakeCase } from "./utils";
import Jimp from "jimp";

const baseUrl = "https://axxvbauccqdrffmnozld.supabase.co/storage/v1/object/public/inventory";

const supabase = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const compressImage = async (image: Buffer) => {
  const jimpImg = await Jimp.read(image);
  return await jimpImg.resize(256, 256).quality(80).getBufferAsync(Jimp.MIME_JPEG);
};

const uploadImage = async (image: Buffer, path: string) => {
  const compressedImage = await compressImage(image);
  const res = await supabase.storage
    .from("inventory")
    .upload(path, compressedImage.buffer, { contentType: "image/jpeg" });
  return `${baseUrl}/${res.data?.path}`;
};

const materials = await prisma.material.findMany();

console.log(`Mapping ${materials.length} materials...`);

await sequentialAsyncOperations(materials, async (material) => {
  const imageResponse = await fetch(material.image);
  const image = Buffer.from(await imageResponse.arrayBuffer());
  const uploadedPath = await uploadImage(image, `materials/${toSnakeCase(material.name)}.jpg`);
  const update = await prisma.material.update({
    where: { id: material.id },
    data: { image: uploadedPath },
  });
  console.log(`Mapped ${material.name} to ${uploadedPath}`);
  return update;
});

const hardwares = await prisma.hardware.findMany();

console.log(`Mapping ${hardwares.length} hardwares...`);

await sequentialAsyncOperations(hardwares, async (hardware) => {
  const imageResponse = await fetch(hardware.image);
  const image = Buffer.from(await imageResponse.arrayBuffer());
  const uploadedPath = await uploadImage(
    image,
    `hardwares/${toSnakeCase(`${hardware.name} ${hardware.color}`)}.jpg`
  );
  const update = await prisma.hardware.update({
    where: { id: hardware.id },
    data: { image: uploadedPath },
  });
  console.log(`Mapped ${hardware.name} to ${uploadedPath}`);
  return update;
});

console.log("Done!");
