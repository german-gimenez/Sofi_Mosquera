"use client";

import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className="bg-brand-negro/50 text-brand-blanco-calido px-4 py-2 text-sm"
      >
        Cargando...
      </button>
    );
  }

  if (!cloudName) {
    return (
      <div className="text-xs text-red-600">
        Cloudinary no configurado (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME missing)
      </div>
    );
  }

  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary-sign"
      options={{
        cloudName,
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
