import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

async function handleUpdate(req: Request) {
  try {
    const { id, name, description, quantity } = await req.json();

    const updated = await prisma.item.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(quantity !== undefined && { quantity: Number(quantity) }),
      },
    });

    return NextResponse.json({ message: "Item updated successfully", updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export const PATCH = handleUpdate;
export const POST = handleUpdate;
