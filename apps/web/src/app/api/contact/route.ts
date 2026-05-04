import { NextResponse } from "next/server";
import { createDb, inquiries } from "@sofi/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().optional(),
  locale: z.string().optional(),
  _hp: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (parsed.data._hp && parsed.data._hp.length > 0) {
      return NextResponse.json({ ok: true });
    }
    const db = createDb();
    await db.insert(inquiries).values({
      kind: "contact-form",
      name: parsed.data.name,
      email: parsed.data.email,
      message: [parsed.data.subject, parsed.data.message].filter(Boolean).join("\n\n"),
      locale: parsed.data.locale ?? "es",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
