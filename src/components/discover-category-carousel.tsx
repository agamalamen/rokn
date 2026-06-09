"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCategoryBackgroundColor } from "@/lib/shopify/category-colors";
import { shopifyImageUrl } from "@/lib/shopify/image";
import type { CategoryBrowseItem, CategoryPreviewProduct } from "@/lib/shopify/types";
import { getShopUrl } from "@/lib/shopify/vendor-collection";

const DISCOVER_MODULE_LIMIT = 6;

type DiscoverShopCarouselProps = {
  shops: CategoryBrowseItem[];
};

type DiscoverTileProps = {
  product: CategoryPreviewProduct;
  colorIndex: number;
};

function DiscoverTile({ product, colorIndex }: DiscoverTileProps) {
  const backgroundColor = getCategoryBackgroundColor(colorIndex);

  return (
    <Link
      href={`/products/${product.handle}`}
      className="relative aspect-square overflow-hidden"
      style={{ backgroundColor }}
    >
      {product.featuredImage ? (
        <Image
          src={shopifyImageUrl(product.featuredImage.url, 400)}
          alt={product.featuredImage.altText ?? product.title}
          width={400}
          height={400}
          sizes="(max-width: 640px) 35vw, 280px"
          className="h-full w-full object-cover"
        />
      ) : null}
    </Link>
  );
}

type DiscoverShopGroupProps = {
  shop: CategoryBrowseItem;
  colorOffset: number;
};

function DiscoverShopGroup({ shop, colorOffset }: DiscoverShopGroupProps) {
  const tiles = shop.previewProducts.slice(0, 4);

  if (tiles.length === 0) {
    return null;
  }

  return (
    <div
      data-discover-group
      className="w-[calc((100vw-3rem)/1.333)] shrink-0 snap-start sm:w-[calc((100vw-4rem)/1.333)] lg:w-[calc((100vw-5rem)/1.333)]"
    >
      <div className="grid aspect-square grid-cols-2 grid-rows-2 overflow-hidden rounded-3xl">
        {tiles.map((product, index) => (
          <DiscoverTile
            key={product.id}
            product={product}
            colorIndex={colorOffset + index}
          />
        ))}
      </div>

      <Link
        href={getShopUrl(shop)}
        className="mt-3 inline-flex items-center gap-2"
      >
        <span className="text-base font-bold tracking-tight text-foreground">
          {shop.title}
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface">
          <ChevronRight className="h-4 w-4 text-foreground" aria-hidden />
        </span>
      </Link>
    </div>
  );
}

export function DiscoverShopCarousel({ shops }: DiscoverShopCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const visibleShops = shops
    .filter((shop) => shop.previewProducts.length >= 4)
    .slice(0, DISCOVER_MODULE_LIMIT);

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
  }, [visibleShops, updateScrollState]);

  function scrollBy(direction: "left" | "right") {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const firstGroup = element.querySelector<HTMLElement>("[data-discover-group]");
    const gap = 16;
    const amount =
      (firstGroup?.offsetWidth ?? element.clientWidth * 0.75) + gap;
    element.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  if (visibleShops.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <div className="relative">
        {canScrollLeft && (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent sm:w-12"
              aria-hidden
            />
            <button
              type="button"
              onClick={() => scrollBy("left")}
              className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-white shadow-md sm:left-4"
              aria-label="Scroll shops left"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="shelf-scroll flex snap-x snap-mandatory items-start gap-4 overflow-x-auto py-1.5 scroll-pl-4 pl-4 pr-4 sm:gap-5 sm:scroll-pl-6 sm:pl-6 sm:pr-6 lg:scroll-pl-8 lg:pl-8 lg:pr-8"
        >
          {visibleShops.map((shop, index) => (
            <DiscoverShopGroup
              key={shop.id}
              shop={shop}
              colorOffset={index * 4}
            />
          ))}
        </div>

        {canScrollRight && (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-12"
              aria-hidden
            />
            <button
              type="button"
              onClick={() => scrollBy("right")}
              className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-white shadow-md sm:right-4"
              aria-label="Scroll shops right"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
