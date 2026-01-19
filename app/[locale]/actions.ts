"use server";

import prisma from "@/lib/prisma";
import { shuffleArray } from "@/lib/utils";

export async function getProductImages(): Promise<string[]> {
  const data = await prisma.product.findMany({ select: { image: true } });
  if (data.length === 0) return [];
  return shuffleArray(data.map((product) => product.image)).slice(0, 10);
}
