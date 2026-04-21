"use client";

import { useEffect, useRef, useState } from "react";
import { cldGallery, cldVideoUrl, isVideoPublicId } from "@sofi/ui";

interface Props {
  publicId: string;
  alt: string;
  priority?: boolean;
  /** Render at this aspect ratio container (parent controls it). */
  className?: string;
}

/**
 * Renders either an <img> (for image public_ids) or an autoplay muted looping
 * <video> (for video public_ids prefixed with "video:").
 *
 * Videos are lazy-loaded: the poster JPG shows first, the MP4 is attached only
 * when the element enters the viewport — avoids downloading all clips upfront.
 * Respects prefers-reduced-motion (static poster only).
 */
export function GalleryMedia({ publicId, alt, priority = false, className = "" }: Props) {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const isVideo = isVideoPublicId(publicId);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const listener = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", listener);
    return () => mq.removeEventListener?.("change", listener);
  }, []);

  useEffect(() => {
    if (!isVideo || reducedMotion) return;
    if (priority) {
      setShouldLoadVideo(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShouldLoadVideo(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isVideo, priority, reducedMotion]);

  const poster = cldGallery(publicId);

  if (isVideo && shouldLoadVideo && !reducedMotion) {
    return (
      <div ref={ref} className={className}>
        <video
          className="w-full h-full object-cover"
          src={cldVideoUrl(publicId, { w: 1600 })}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
        />
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt={alt}
        className="w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </div>
  );
}
