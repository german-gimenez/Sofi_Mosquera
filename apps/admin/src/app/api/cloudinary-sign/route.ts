import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { SOFI_NAMESPACE } from "@sofi/ui";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Sign a Cloudinary upload request.
 *
 * Hard rule: the resulting upload MUST land under `${SOFI_NAMESPACE}/...`. We
 * normalize the `folder` and `public_id` server-side so a malicious or buggy
 * client cannot deposit assets in another project's namespace
 * (suplement-app, zapata-goma, underfeet, or root) by tampering with
 * `paramsToSign`.
 */
export async function POST(req: Request) {
  // Require auth. When Clerk is enabled this enforces Clerk session.
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!hasClerk) {
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

  // Enforce the Sofi namespace before signing. Mutating paramsToSign here
  // means the client gets a signature that ONLY validates uploads to a path
  // under sofi-mosquera/. If a client tries to upload elsewhere with this
  // signature, Cloudinary rejects it.
  const params = paramsToSign as Record<string, unknown>;
  const folder = typeof params.folder === "string" ? params.folder.replace(/^\/+/, "") : "";
  const publicId =
    typeof params.public_id === "string" ? params.public_id.replace(/^\/+/, "") : "";

  // Normalize folder: must start with sofi-mosquera/ (or BE sofi-mosquera).
  if (folder && folder !== SOFI_NAMESPACE && !folder.startsWith(`${SOFI_NAMESPACE}/`)) {
    params.folder = `${SOFI_NAMESPACE}/${folder}`;
  } else if (!folder && !publicId.startsWith(`${SOFI_NAMESPACE}/`)) {
    params.folder = SOFI_NAMESPACE;
  }

  // Normalize public_id: if explicitly given, ensure it's also under namespace
  // (Cloudinary's resulting full id = folder + "/" + public_id, so a public_id
  // alone without folder is the only way to escape; we cover both)
  if (publicId && !publicId.startsWith(`${SOFI_NAMESPACE}/`) && !params.folder) {
    params.public_id = `${SOFI_NAMESPACE}/${publicId}`;
  }

  // Final guard: reject if anything still tries to point outside.
  const finalFolder = String(params.folder ?? "");
  const finalId = String(params.public_id ?? "");
  if (finalFolder && finalFolder !== SOFI_NAMESPACE && !finalFolder.startsWith(`${SOFI_NAMESPACE}/`)) {
    return NextResponse.json(
      {
        error: `Refused: upload folder must be under "${SOFI_NAMESPACE}/" (got "${finalFolder}")`,
      },
      { status: 400 }
    );
  }
  if (finalId.includes("..") || finalId.startsWith("/")) {
    return NextResponse.json(
      { error: "Invalid public_id (no path traversal)" },
      { status: 400 }
    );
  }

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET
  );

  return NextResponse.json({ signature, params });
}
