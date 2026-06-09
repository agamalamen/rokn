"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCategoryBackgroundColor,
  getCategoryLabelColor,
} from "@/lib/shopify/category-colors";
import type { Collection } from "@/lib/shopify/types";
import { getShopUrl } from "@/lib/shopify/vendor-collection";

type CategoryCollectionCarouselProps = {
  collections: Collection[];
};

type CategoryPillProps = {
  collection: Collection;
  colorIndex: number;
};

function CategoryPill({ collection, colorIndex }: CategoryPillProps) {
  const backgroundColor = getCategoryBackgroundColor(colorIndex);
  const labelColor = getCategoryLabelColor(backgroundColor);

  return (
    <Link
      href={getShopUrl(collection)}
      className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-border/80 bg-white py-1.5 pl-1.5 pr-4 shadow-sm transition-shadow motion-safe:hover:shadow-md"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{ backgroundColor }}
      >
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            width={80}
            height={80}
            sizes="40px"
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="text-sm font-bold"
            style={{ color: labelColor }}
          >
            {collection.title.charAt(0)}
          </span>
        )}
      </div>
      <span className="whitespace-nowrap text-sm font-semibold leading-none text-foreground">
        {collection.title}
      </span>
    </Link>
  );
}

export function CategoryCollectionCarousel({
  collections,
}: CategoryCollectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    setCanScrollLeft(element.scrollLeft > 0);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    updateScrollState();
    element.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [collections, updateScrollState]);

  function scrollBy(direction: "left" | "right") {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const amount = element.clientWidth * 0.65;
    element.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      <div className="relative">
        {canScrollLeft && (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-14 lg:w-16"
              aria-hidden
            />
            <button
              type="button"
              onClick={() => scrollBy("left")}
              className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-white shadow-md sm:left-4 lg:left-6"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="shelf-scroll flex items-center gap-2.5 overflow-x-auto py-1.5 scroll-pl-4 pl-4 pr-4 sm:gap-3 sm:scroll-pl-6 sm:pl-6 sm:pr-6 lg:mx-8 lg:scroll-pl-0 lg:pl-0 lg:pr-0"
        >
          {collections.map((collection, index) => (
            <CategoryPill
              key={collection.id}
              collection={collection}
              colorIndex={index}
            />
          ))}
        </div>

        {canScrollRight && (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-14 lg:w-16"
              aria-hidden
            />
            <button
              type="button"
              onClick={() => scrollBy("right")}
              className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-white shadow-md sm:right-4 lg:right-6"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
