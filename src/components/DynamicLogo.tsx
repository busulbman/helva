"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getSiteSettings } from "@/lib/firebase";

interface DynamicLogoProps {
  className?: string;
  fallbackSrc?: string;
  alt?: string;
}

function isValidImageUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && url.trim() !== "";
}

export default function DynamicLogo({
  className = "h-12",
  fallbackSrc = "/assets/logo.png",
  alt = "Sipahioğlu Çekme Helva",
}: DynamicLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>(fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchLogo() {
      try {
        const settings = await getSiteSettings();
        if (isValidImageUrl(settings?.logo_url)) {
          setLogoUrl(settings.logo_url);
          setHasError(false);
        }
      } catch (error) {
        console.error("[DynamicLogo] Firebase settings fetch failed:", error);
      }
    }
    fetchLogo();
  }, []);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setLogoUrl(fallbackSrc);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "2.5/1" }}>
      <Image
        src={logoUrl}
        alt={alt}
        fill
        sizes="200px"
        className="object-contain"
        onError={handleError}
        priority
      />
    </div>
  );
}
