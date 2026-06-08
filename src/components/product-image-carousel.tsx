"use client";

import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { shopifyImageUrl } from "@/lib/shopify/image";
import type { Image as ShopifyImage } from "@/lib/shopify/types";

type ProductImageCarouselProps = {
  images: ShopifyImage[];
  title: string;
};

type ImageLightboxProps = {
  images: ShopifyImage[];
  title: string;
  initialIndex: number;
  onClose: () => void;
};

function ImageLightbox({
  images,
  title,
  initialIndex,
  onClose,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(false);
  const skipLoadingRef = useRef(true);
  const image = images[index];
  const hasMultiple = images.length > 1;

  const goToIndex = useCallback((nextIndex: number) => {
    setIndex((current) => (nextIndex === current ? current : nextIndex));
  }, []);

  const showPrevious = useCallback(() => {
    goToIndex(Math.max(index - 1, 0));
  }, [goToIndex, index]);

  const showNext = useCallback(() => {
    goToIndex(Math.min(index + 1, images.length - 1));
  }, [goToIndex, images.length, index]);

  useEffect(() => {
    setIndex(initialIndex);
    skipLoadingRef.current = true;
    setIsLoading(false);
  }, [initialIndex]);

  useEffect(() => {
    if (skipLoadingRef.current) {
      skipLoadingRef.current = false;
      return;
    }

    setIsLoading(true);
  }, [index]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft" && !isLoading) {
        showPrevious();
      }

      if (event.key === "ArrowRight" && !isLoading) {
        showNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoading, onClose, showNext, showPrevious]);

  if (!image) {
    return null;
  }

  const imageWidth = image.width ?? 1200;
  const imageHeight = image.height ?? 1500;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} images`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        {hasMultiple ? (
          <p className="text-sm font-medium text-white/80">
            {index + 1} / {images.length}
          </p>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          aria-label="Close image viewer"
        >
          <X className="h-6 w-6" aria-hidden />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {hasMultiple && (
          <button
            type="button"
            onClick={showPrevious}
            disabled={index === 0 || isLoading}
            className="absolute left-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 sm:left-4"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="relative flex h-full max-h-[75vh] w-full max-w-3xl items-center justify-center"
          aria-label="Close image viewer"
        >
          {isLoading && (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center"
              aria-live="polite"
              aria-busy="true"
            >
              <Loader2 className="h-8 w-8 animate-spin text-white/80" aria-hidden />
              <span className="sr-only">Loading image</span>
            </div>
          )}
          <Image
            key={image.url}
            src={shopifyImageUrl(image.url, 1600)}
            alt={image.altText ?? `${title} image ${index + 1}`}
            width={imageWidth}
            height={imageHeight}
            sizes="100vw"
            priority
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            className={`max-h-[75vh] w-auto max-w-full object-contain transition-opacity duration-200 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        </button>

        {hasMultiple && (
          <button
            type="button"
            onClick={showNext}
            disabled={index === images.length - 1 || isLoading}
            className="absolute right-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 sm:right-4"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}

type CarouselImageProps = {
  image: ShopifyImage;
  title: string;
  index: number;
  priority?: boolean;
  onOpen: (index: number) => void;
  className?: string;
};

function CarouselImage({
  image,
  title,
  index,
  priority = false,
  onOpen,
  className,
}: CarouselImageProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={`relative overflow-hidden bg-surface ${className ?? ""}`}
      aria-label={`View ${title} image ${index + 1} full size`}
    >
      <Image
        src={shopifyImageUrl(image.url, 640)}
        alt={image.altText ?? `${title} image ${index + 1}`}
        fill
        priority={priority}
        sizes="82vw"
        className="cursor-zoom-in object-cover transition-transform duration-300 hover:scale-[1.02]"
      />
    </button>
  );
}

export function ProductImageCarousel({
  images,
  title,
}: ProductImageCarouselProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="mt-4 flex justify-center px-4">
        <div className="flex aspect-[4/5] w-[82vw] max-w-[320px] items-center justify-center rounded-2xl bg-surface">
          <span className="text-sm text-muted">No image available</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {images.length === 1 ? (
        <div className="mt-4 flex justify-center px-4">
          <CarouselImage
            image={images[0]}
            title={title}
            index={0}
            priority
            onOpen={setLightboxIndex}
            className="aspect-[4/5] w-[82vw] max-w-[320px] rounded-2xl"
          />
        </div>
      ) : (
        <div className="mt-4">
          <div className="shelf-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 pl-4 pr-4">
            {images.map((image, index) => (
              <CarouselImage
                key={`${image.url}-${index}`}
                image={image}
                title={title}
                index={index}
                priority={index === 0}
                onOpen={setLightboxIndex}
                className="aspect-[4/5] w-[82vw] max-w-[320px] shrink-0 snap-center rounded-2xl"
              />
            ))}
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          title={title}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
