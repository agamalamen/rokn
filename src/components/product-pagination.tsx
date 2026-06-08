import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { PageInfo } from "@/lib/shopify/types";

type ProductPaginationProps = {
  pageInfo: PageInfo;
  page: number;
  totalPages: number;
};

function paginationButtonClass(enabled: boolean) {
  return enabled
    ? "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface"
    : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted opacity-50";
}

export function ProductPagination({
  pageInfo,
  page,
  totalPages,
}: ProductPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const showPrevious = pageInfo.hasPreviousPage && pageInfo.startCursor;
  const showNext = pageInfo.hasNextPage && pageInfo.endCursor;
  const previousHref =
    page <= 2
      ? "/products"
      : `/products?before=${encodeURIComponent(pageInfo.startCursor!)}&page=${page - 1}`;
  const nextHref = `/products?after=${encodeURIComponent(pageInfo.endCursor!)}&page=${page + 1}`;

  return (
    <nav
      aria-label="Product pagination"
      className="flex items-center justify-center gap-4 px-4 py-8 sm:px-6 lg:px-8"
    >
      {showPrevious ? (
        <Link
          href={previousHref}
          className={paginationButtonClass(true)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </Link>
      ) : (
        <span className={paginationButtonClass(false)} aria-hidden>
          <ChevronLeft className="h-5 w-5" />
        </span>
      )}

      <p className="min-w-[7rem] text-center text-sm font-medium text-foreground">
        Page {page} of {totalPages}
      </p>

      {showNext ? (
        <Link
          href={nextHref}
          className={paginationButtonClass(true)}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </Link>
      ) : (
        <span className={paginationButtonClass(false)} aria-hidden>
          <ChevronRight className="h-5 w-5" />
        </span>
      )}
    </nav>
  );
}
