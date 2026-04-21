import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createDb, artworks } from "@sofi/db";

export async function POST(req: Request) {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!hasClerk) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  }
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createDb();
  const body = await req.json();

  const {
    slug,
    title,
    series,
    year,
    widthCm,
    heightCm,
    technique,
    priceArs,
    status,
    featured,
    publish,
    coverUrl,
  } = body;

  if (!slug || !title) {
    return NextResponse.json({ error: "slug and title required" }, { status: 400 });
  }

  await db.insert(artworks).values({
    slug,
    title,
    series: series || null,
    year: year || null,
    widthCm: widthCm || null,
    heightCm: heightCm || null,
    technique: technique || null,
    priceArs: priceArs || null,
    status: status || "disponible",
    coverUrl: coverUrl || null,
    featured: !!featured,
    publishedAt: publish ? new Date() : null,
  });

  return NextResponse.json({ ok: true });
}
