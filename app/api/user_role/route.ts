import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("user_id");
    if (!userId) throw new Error("missing_user_id");
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!profile) throw new Error("user_not_found");
    return new Response(JSON.stringify({ role: profile.role }), {
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: err.statusCode || 500,
    });
  }
}
