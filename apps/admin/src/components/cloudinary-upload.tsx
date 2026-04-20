"use client";

import { CldUploadWidget } from "next-cloudinary";

interface CloudinaryUploadProps {
  folder?: string;
  publicId?: string;
  onUploaded?: (publicId: string, url: string) => void;
  label?: string;
}

export function CloudinaryUpload({
  folder = "sofi-mosquera",
  publicId,
  onUploaded,
  label = "Subir imagen",
}: CloudinaryUploadProps) {
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary-sign"
      options={{
        folder,
        publicId,
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
        maxFileSize: 20 * 1024 * 1024,
        sources: ["local", "url", "camera"],
        multiple: true,
        cropping: false,
        showUploadMoreButton: true,
      }}
      onSuccess={(result) => {
        if (result.event === "success" && typeof result.info === "object") {
          const info = result.info as { public_id: string; secure_url: string };
          onUploaded?.(info.public_id, info.secure_url);
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="bg-brand-negro text-brand-blanco-calido px-4 py-2 text-sm hover:bg-brand-negro-suave transition-colors"
        >
          {label}
        </button>
      )}
    </CldUploadWidget>
  );
}
