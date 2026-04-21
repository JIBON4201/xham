import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, copyFile, unlink } from "fs/promises";
import { join } from "path";
import { db } from "@/lib/db";

// POST /api/admin/upload — upload image + optionally update card
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const cardId = formData.get("cardId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use JPG, PNG, WebP or GIF" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() || "png";
    const galleryDir = join(process.cwd(), "public", "ai-gallery");

    await mkdir(galleryDir, { recursive: true });

    // If cardId provided, overwrite the scene's original file path
    let imageUrl: string;
    if (cardId) {
      const card = await db.galleryCard.findUnique({ where: { id: cardId } });
      if (card) {
        // Use the card's sceneId for the filename (e.g. scene-05.jpg)
        const stableFileName = `${card.sceneId}.${ext}`;
        const stablePath = join(galleryDir, stableFileName);
        await writeFile(stablePath, buffer);
        imageUrl = `/ai-gallery/${stableFileName}`;

        // Delete old UUID file if it's different from the stable name
        if (card.image && !card.image.includes(card.sceneId)) {
          try {
            const oldFile = join(process.cwd(), "public", card.image);
            await unlink(oldFile);
          } catch {}
        }

        await db.galleryCard.update({
          where: { id: cardId },
          data: { image: imageUrl },
        });
      } else {
        // Card not found, save with UUID
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const filePath = join(galleryDir, fileName);
        await writeFile(filePath, buffer);
        imageUrl = `/ai-gallery/${fileName}`;
      }
    } else {
      // No cardId — save with UUID
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = join(galleryDir, fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/ai-gallery/${fileName}`;
    }

    return NextResponse.json({ url: imageUrl, cardUpdated: !!cardId });
  } catch (error) {
    console.error("POST /api/admin/upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
