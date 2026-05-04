import { NextResponse } from "next/server";
import { createDb, inquiries } from "@sofi/db";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  hp: z.string().optional(),
  locale: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (parsed.data.hp && parsed.data.hp.length > 0) {
      return NextResponse.json({ ok: true });
    }
    const db = createDb();
    await db.insert(inquiries).values({
      kind: "newsletter",
      email: parsed.data.email,
      locale: parsed.data.locale ?? "es",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
