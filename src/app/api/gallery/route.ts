import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/gallery — fetch all active cards, ordered
export async function GET() {
  try {
    const cards = await db.galleryCard.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(cards);
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery cards" }, { status: 500 });
  }
}

// POST /api/gallery — create a new card
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sceneId, title, tag, image, duration, views, icon, category, order } = body;

    if (!title || !image) {
      return NextResponse.json({ error: "title and image are required" }, { status: 400 });
    }

    const maxOrder = await db.galleryCard.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const nextOrder = order ?? (maxOrder ? maxOrder.order + 1 : 1);

    const card = await db.galleryCard.create({
      data: {
        sceneId: sceneId ?? `scene-${String(nextOrder).padStart(2, "0")}`,
        title,
        tag: tag ?? "AI Preview",
        image,
        duration: duration ?? "2:30",
        views: views ?? "10K",
        icon: icon ?? "Sparkles",
        category: category ?? "all",
        order: nextOrder,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json({ error: "sceneId already exists" }, { status: 409 });
    }
    console.error("POST /api/gallery error:", error);
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
  }
}
