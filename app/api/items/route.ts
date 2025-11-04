import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all items with taken history and user info
    const items = await prisma.item.findMany({
      include: {
        takenitem: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate stats
    const enrichedItems = items.map((item) => {
      const totalTaken =
        item.takenitem?.reduce((sum, t) => sum + (t.quantity || 0), 0) || 0;

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        totalQuantity: item.quantity,
        takenQuantity: totalTaken,
        availableQuantity: item.quantity - totalTaken,
        takenBy: item.takenitem.map((t) => ({
          userName: t.user?.name || "Unknown",
          userEmail: t.user?.email || "N/A",
          quantity: t.quantity,
          takenAt: t.takenAt,
        })),
        createdAt: item.createdAt,
      };
    });

    // Optional summary
    const summary = {
      totalItems: enrichedItems.length,
      totalStock: enrichedItems.reduce((sum, i) => sum + i.totalQuantity, 0),
      totalTaken: enrichedItems.reduce((sum, i) => sum + i.takenQuantity, 0),
      totalAvailable: enrichedItems.reduce(
        (sum, i) => sum + i.availableQuantity,
        0
      ),
    };

    return NextResponse.json({ summary, items: enrichedItems });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { message: "Error fetching items" },
      { status: 500 }
    );
  }
}
