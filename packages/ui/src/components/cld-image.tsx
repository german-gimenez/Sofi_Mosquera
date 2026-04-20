import { cldUrl, type CldUrlOptions } from "../lib/cloudinary";

interface CldImageProps extends CldUrlOptions {
  src: string | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

/**
 * Simple <img> wrapper that resolves Cloudinary public_ids.
 * Accepts both public_ids and full URLs.
 *
 * For advanced optimization use Next.js <Image> with the helper cldUrl() directly.
 */
export function CldImage({
  src,
  alt,
  className,
  priority,
  sizes,
  fill,
  width,
  height,
  ...opts
}: CldImageProps) {
  if (!src) return null;

  const url = cldUrl(src, { w: opts.w ?? width ?? 1200, ...opts });

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      sizes={sizes}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      style={fill ? { width: "100%", height: "100%", objectFit: "cover" } : undefined}
    />
  );
}
