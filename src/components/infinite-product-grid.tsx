"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { loadMoreProducts } from "@/actions/products";
import { ProductCard } from "@/components/product-card";
import type { PageInfo, ProductCard as ProductCardType } from "@/lib/shopify/types";

type InfiniteProductGridProps = {
  initialProducts: ProductCardType[];
  initialPageInfo: PageInfo;
  emptyMessage?: string;
};

export function InfiniteProductGrid({
  initialProducts,
  initialPageInfo,
  emptyMessage = "No products found.",
}: InfiniteProductGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(() => {
    if (
      loadingRef.current ||
      isPending ||
      !pageInfo.hasNextPage ||
      !pageInfo.endCursor
    ) {
      return;
    }

    loadingRef.current = true;

    startTransition(async () => {
      try {
        const result = await loadMoreProducts(pageInfo.endCursor!);
        setProducts((current) => [...current, ...result.products]);
        setPageInfo(result.pageInfo);
      } finally {
        loadingRef.current = false;
      }
    });
  }, [isPending, pageInfo.endCursor, pageInfo.hasNextPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !pageInfo.hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, pageInfo.hasNextPage]);

  if (products.length === 0) {
    return (
      <p className="mx-4 rounded-2xl bg-surface px-6 py-16 text-center text-sm text-muted sm:mx-6 lg:mx-8">
        {emptyMessage}
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4 sm:grid-cols-3 sm:gap-x-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 4}
          />
        ))}
      </div>

      {pageInfo.hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center px-4 py-8 sm:px-6 lg:px-8">
          {isPending && (
            <p className="text-sm text-muted" aria-live="polite">
              Loading more products...
            </p>
          )}
        </div>
      )}
    </>
  );
}
