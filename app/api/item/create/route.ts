import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"; // adjust to your prisma path

export async function POST(req: Request) {
  try {
    const { name, description, quantity } = await req.json();

    if (!name || !quantity) {
      return NextResponse.json({ message: "Name and quantity are required" }, { status: 400 });
    }

    // 🧠 Check if item already exists
    const existingItem = await prisma.item.findFirst({
      where: { name: { equals: name, mode: "insensitive" } }, // case-insensitive match
    });

    if (existingItem) {
      // 🔁 If exists, update its quantity
      const updatedItem = await prisma.item.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + Number(quantity),
          description: description || existingItem.description,
        },
      });

      return NextResponse.json({
        message: `✅ Item already existed, updated quantity to ${updatedItem.quantity}.`,
        item: updatedItem,
      });
    }

    // 🆕 If not exist, create a new one
    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        quantity: Number(quantity),
      },
    });

    return NextResponse.json({ message: "✅ Item created successfully!", item: newItem });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "⚠️ Server error while creating item." }, { status: 500 });
  }
}
