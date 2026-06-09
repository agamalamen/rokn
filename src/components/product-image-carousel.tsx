"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductImageLightboxHost } from "@/components/product-image-lightbox-host";
import { shopifyImageUrl } from "@/lib/shopify/image";
import type { Image as ShopifyImage } from "@/lib/shopify/types";

const HERO_WIDTH = 640;
const HERO_HEIGHT = 800;
const DESKTOP_HERO_WIDTH = 960;

type ProductImageCarouselProps = {
  images: ShopifyImage[];
  title: string;
};

type CarouselSlideProps = {
  image: ShopifyImage;
  title: string;
  index: number;
  priority?: boolean;
  className?: string;
  imageWidth?: number;
  sizes?: string;
};

function CarouselSlide({
  image,
  title,
  index,
  priority = false,
  className,
  imageWidth = HERO_WIDTH,
  sizes = "320px",
}: CarouselSlideProps) {
  return (
    <button
      type="button"
      data-image-index={index}
      className={`overflow-hidden bg-surface ${className ?? ""}`}
      aria-label={`View ${title} image ${index + 1} full size`}
    >
      <Image
        src={shopifyImageUrl(image.url, imageWidth)}
        alt={image.altText ?? `${title} image ${index + 1}`}
        width={imageWidth}
        height={HERO_HEIGHT}
        priority={priority}
        sizes={sizes}
        className={`h-full w-full cursor-zoom-in object-cover ${
          priority
            ? ""
            : "motion-safe:transform-gpu motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.02]"
        }`}
      />
    </button>
  );
}

function MobileImageCarousel({
  images,
  title,
}: ProductImageCarouselProps) {
  if (images.length === 1) {
    return (
      <div className="mt-4 flex justify-center px-4 lg:hidden">
        <CarouselSlide
          image={images[0]}
          title={title}
          index={0}
          priority
          className="aspect-[4/5] w-[82vw] max-w-[320px] rounded-2xl"
        />
      </div>
    );
  }

  return (
    <div className="mt-4 lg:hidden">
      <div className="shelf-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 pl-4 pr-4">
        {images.map((image, index) => (
          <CarouselSlide
            key={`${image.url}-${index}`}
            image={image}
            title={title}
            index={index}
            priority={index === 0}
            className="aspect-[4/5] w-[82vw] max-w-[320px] shrink-0 snap-center rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}

function DesktopImageGallery({
  images,
  title,
}: ProductImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];

  return (
    <div className="hidden lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-4 lg:pt-8">
      {images.length > 1 && (
        <div className="relative h-full min-h-0 w-[4.5rem] shrink-0">
          <div className="shelf-scroll absolute inset-0 flex flex-col gap-3 overflow-y-auto overscroll-y-contain px-0.5 py-1">
            {images.map((image, index) => {
              const selected = index === selectedIndex;

              return (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`shrink-0 rounded-xl border-2 transition-colors ${
                    selected
                      ? "border-foreground"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Show ${title} image ${index + 1}`}
                  aria-current={selected ? "true" : undefined}
                >
                  <Image
                    src={shopifyImageUrl(image.url, 120)}
                    alt={image.altText ?? `${title} thumbnail ${index + 1}`}
                    width={72}
                    height={72}
                    sizes="72px"
                    className="h-[calc(4.5rem-4px)] w-[calc(4.5rem-4px)] rounded-[10px] object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <CarouselSlide
        image={selectedImage}
        title={title}
        index={selectedIndex}
        priority
        imageWidth={DESKTOP_HERO_WIDTH}
        sizes="(min-width: 1024px) 40vw, 320px"
        className="aspect-[4/5] w-full rounded-2xl"
      />
    </div>
  );
}

export function ProductImageCarousel({
  images,
  title,
}: ProductImageCarouselProps) {
  if (images.length === 0) {
    return (
      <div className="mt-4 flex justify-center px-4 lg:mt-0 lg:px-0 lg:pt-8">
        <div className="flex aspect-[4/5] w-[82vw] max-w-[320px] items-center justify-center rounded-2xl bg-surface lg:w-full lg:max-w-none">
          <span className="text-sm text-muted">No image available</span>
        </div>
      </div>
    );
  }

  return (
    <ProductImageLightboxHost images={images} title={title}>
      <MobileImageCarousel images={images} title={title} />
      <DesktopImageGallery images={images} title={title} />
    </ProductImageLightboxHost>
  );
}
