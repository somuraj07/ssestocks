import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || !quantity) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    const available = Number(item.quantity);
    if (available < quantity) {
      return NextResponse.json({ message: "Not enough quantity available" }, { status: 400 });
    }

    // Update item quantity
    await prisma.item.update({
      where: { id: itemId },
      data: { quantity: available - quantity },
    });

    // Record taken item
    await prisma.takenitem.create({
      data: {
        userId: session.user.id,
        itemId,
        quantity,
      },
    });

    return NextResponse.json({ message: "Item taken successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
