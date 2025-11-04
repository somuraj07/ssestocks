import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "No items found in Excel." }, { status: 400 });
    }

    const created = await prisma.item.createMany({
      data: items.map((i) => ({
        name: i.name,
        description: i.description,
        quantity: Number(i.quantity),
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "Items uploaded successfully.", count: created.count });
  } catch (error) {
    console.error("Bulk upload error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
