"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { Image as ShopifyImage } from "@/lib/shopify/types";

type ProductImageCarouselProps = {
  images: ShopifyImage[];
  title: string;
};

export function ProductImageCarousel({
  images,
  title,
}: ProductImageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || container.clientWidth === 0) {
      return;
    }

    setActiveIndex(Math.round(container.scrollLeft / container.clientWidth));
  }, []);

  function scrollTo(index: number) {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      left: index * container.clientWidth,
      behavior: "smooth",
    });
  }

  if (images.length === 0) {
    return (
      <div className="relative aspect-square bg-surface sm:mx-auto sm:mt-6 sm:max-w-lg sm:overflow-hidden sm:rounded-2xl">
        <div className="flex h-full items-center justify-center text-muted">
          No image available
        </div>
      </div>
    );
  }

  return (
    <div className="sm:mx-auto sm:mt-6 sm:max-w-lg">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="shelf-scroll flex aspect-square snap-x snap-mandatory overflow-x-auto bg-surface sm:rounded-2xl"
      >
        {images.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className="relative aspect-square min-w-full shrink-0 snap-center snap-always"
          >
            <Image
              src={image.url}
              alt={image.altText ?? `${title} image ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-4 bg-foreground"
                  : "w-1.5 bg-border"
              }`}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
