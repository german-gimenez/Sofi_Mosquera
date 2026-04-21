import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createDb, projects } from "@sofi/db";

async function requireAuth() {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!hasClerk) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  }
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(req: Request) {
  const unauthorized = await requireAuth();
  if (unauthorized) return unauthorized;

  const db = createDb();
  const body = await req.json();

  const {
    slug,
    title,
    summary,
    category,
    year,
    location,
    featured,
    publish,
    coverUrl,
    gallery,
  } = body;

  if (!slug || !title) {
    return NextResponse.json({ error: "slug and title required" }, { status: 400 });
  }

  await db.insert(projects).values({
    slug,
    title,
    summary: summary || null,
    category: category || "residencial",
    year: year || null,
    location: location || null,
    coverUrl: coverUrl || null,
    gallery: gallery || [],
    featured: !!featured,
    publishedAt: publish ? new Date() : null,
  });

  return NextResponse.json({ ok: true });
}
