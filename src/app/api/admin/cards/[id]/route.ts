import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT /api/admin/cards/[id] — update card
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const card = await db.galleryCard.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(card);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2025") {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }
    console.error("PUT /api/admin/cards/[id] error:", error);
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
  }
}

// DELETE /api/admin/cards/[id] — delete card
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.galleryCard.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2025") {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }
    console.error("DELETE /api/admin/cards/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}
