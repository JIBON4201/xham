import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/gallery/[id] — fetch single card
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const card = await db.galleryCard.findUnique({ where: { id } });
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }
    return NextResponse.json(card);
  } catch (error) {
    console.error("GET /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch card" }, { status: 500 });
  }
}

// PUT /api/gallery/[id] — update a card
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
    console.error("PUT /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
  }
}

// DELETE /api/gallery/[id] — delete a card
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
    console.error("DELETE /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}
