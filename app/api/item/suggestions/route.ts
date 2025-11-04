import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"; // adjust path

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (q.length < 1) return NextResponse.json({ items: [] });

  const items = await prisma.item.findMany({
    where: {
      name: { contains: q, mode: "insensitive" },
    },
    select: { id: true, name: true },
    take: 8, // limit suggestions
  });

  return NextResponse.json({ items });
}
