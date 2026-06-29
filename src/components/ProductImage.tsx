"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getSiteSettings } from "@/lib/firebase";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const DEFAULT_FALLBACK = "/assets/logo.png";

function isValidImageUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && url.trim() !== "" && !url.includes("unsplash.com");
}

export default function ProductImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  sizes,
  priority = false,
}: ProductImageProps) {
  const [fallbackImage, setFallbackImage] = useState(DEFAULT_FALLBACK);
  const [imgSrc, setImgSrc] = useState(() => isValidImageUrl(src) ? src : DEFAULT_FALLBACK);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchAdminLogo() {
      try {
        const settings = await getSiteSettings();
        if (isValidImageUrl(settings?.logo_url)) {
          setFallbackImage(settings.logo_url);
          if (!isValidImageUrl(src)) {
            setImgSrc(settings.logo_url);
          }
        }
      } catch (error) {
        console.error("[ProductImage] Failed to fetch admin logo:", error);
      }
    }
    fetchAdminLogo();
  }, []);

  useEffect(() => {
    if (isValidImageUrl(src)) {
      setImgSrc(src);
      setHasError(false);
    } else {
      setImgSrc(fallbackImage);
    }
  }, [src, fallbackImage]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackImage);
      console.warn("[ProductImage] Image load failed, using fallback:", src);
    }
  };

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        sizes={sizes}
        priority={priority}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 400}
      height={height || 400}
      className={`object-cover ${className}`}
      onError={handleError}
      priority={priority}
    />
  );
}
