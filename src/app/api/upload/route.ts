import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";

// POST /api/upload — upload image and optionally link to card
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const cardId = formData.get("cardId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use JPG, PNG, WebP or GIF" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate filename
    const ext = file.name.split(".").pop() || "png";
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = join(process.cwd(), "public", "ai-gallery", fileName);

    // Ensure directory exists
    await mkdir(join(process.cwd(), "public", "ai-gallery"), { recursive: true });

    // Write file
    await writeFile(filePath, buffer);

    const imageUrl = `/ai-gallery/${fileName}`;

    // If cardId provided, update the card's image
    if (cardId) {
      await db.galleryCard.update({
        where: { id: cardId },
        data: { image: imageUrl },
      });
    }

    return NextResponse.json({ url: imageUrl, fileName, cardUpdated: !!cardId });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
