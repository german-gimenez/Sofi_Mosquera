import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: Request) {
  // Require auth. When Clerk is enabled this enforces Clerk session.
  // When Clerk is NOT configured, we refuse the request in prod.
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!hasClerk) {
    // In production, bail. In preview/dev without Clerk, still refuse.
    return NextResponse.json(
      {
        error:
          "Auth provider not configured. Cloudinary signing is disabled until Clerk is set up.",
      },
      { status: 503 }
    );
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: "Cloudinary not configured" },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { paramsToSign } = body;

  if (!paramsToSign || typeof paramsToSign !== "object") {
    return NextResponse.json(
      { error: "paramsToSign required" },
      { status: 400 }
    );
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  return NextResponse.json({ signature });
}
