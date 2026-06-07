"use client";

import Image from "next/image";
import type { Image as ShopifyImage } from "@/lib/shopify/types";

type ProductImageCarouselProps = {
  images: ShopifyImage[];
  title: string;
};

export function ProductImageCarousel({
  images,
  title,
}: ProductImageCarouselProps) {
  if (images.length === 0) {
    return (
      <div className="mt-4 flex justify-center px-4">
        <div className="flex aspect-[4/5] w-[82vw] max-w-[320px] items-center justify-center rounded-2xl bg-surface">
          <span className="text-sm text-muted">No image available</span>
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    const image = images[0];

    return (
      <div className="mt-4 flex justify-center px-4">
        <div className="relative aspect-[4/5] w-[82vw] max-w-[320px] overflow-hidden rounded-2xl bg-surface">
          <Image
            src={image.url}
            alt={image.altText ?? title}
            fill
            priority
            sizes="82vw"
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="shelf-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 pl-4 pr-4">
        {images.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className="relative aspect-[4/5] w-[82vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-2xl bg-surface"
          >
            <Image
              src={image.url}
              alt={image.altText ?? `${title} image ${index + 1}`}
              fill
              priority={index === 0}
              sizes="82vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
