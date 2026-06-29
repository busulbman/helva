"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { DbBanner } from "@/lib/firebase";

interface BannerSectionProps {
  banners: DbBanner[];
}

function isValidImageUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && url.trim() !== "" && !url.includes("unsplash.com");
}

export default function BannerSection({ banners }: BannerSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left px-4 py-4"
              >
                {isValidImageUrl(banner.image) && (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/20 relative bg-white/10">
                    <Image
                      src={banner.image}
                      alt={banner.title || "Banner"}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 max-w-2xl">
                  {banner.title && (
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-white mb-2">
                      {banner.title}
                    </h3>
                  )}
                  {banner.description && (
                    <p className="text-base md:text-lg text-white/90 leading-relaxed">
                      {banner.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          {banners.length > 1 && (
            <div className="flex justify-center gap-3 mt-4">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-white scale-110"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
