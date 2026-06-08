import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { PageInfo } from "@/lib/shopify/types";

type CatalogPaginationProps = {
  basePath: string;
  pageInfo: PageInfo;
  page: number;
  totalPages?: number;
  query?: Record<string, string | undefined>;
};

function paginationButtonClass(enabled: boolean) {
  return enabled
    ? "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface"
    : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted opacity-50";
}

function buildHref(
  basePath: string,
  params: Record<string, string | undefined>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function CatalogPagination({
  basePath,
  pageInfo,
  page,
  totalPages,
  query = {},
}: CatalogPaginationProps) {
  const hasMultiplePages =
    totalPages !== undefined ? totalPages > 1 : pageInfo.hasNextPage || page > 1;

  if (!hasMultiplePages) {
    return null;
  }

  const showPrevious = pageInfo.hasPreviousPage && pageInfo.startCursor;
  const showNext = pageInfo.hasNextPage && pageInfo.endCursor;
  const previousHref = buildHref(basePath, {
    ...query,
    before: showPrevious ? pageInfo.startCursor! : undefined,
    after: undefined,
    page: page <= 2 ? undefined : String(page - 1),
  });
  const nextHref = buildHref(basePath, {
    ...query,
    after: showNext ? pageInfo.endCursor! : undefined,
    before: undefined,
    page: String(page + 1),
  });

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-4 px-4 py-8 sm:px-6 lg:px-8"
    >
      {showPrevious ? (
        <Link
          href={previousHref}
          className={paginationButtonClass(true)}
          aria-label="Previous page"
          prefetch
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </Link>
      ) : (
        <span className={paginationButtonClass(false)} aria-hidden>
          <ChevronLeft className="h-5 w-5" />
        </span>
      )}

      <p className="min-w-[7rem] text-center text-sm font-medium text-foreground">
        {totalPages !== undefined
          ? `Page ${page} of ${totalPages}`
          : `Page ${page}`}
      </p>

      {showNext ? (
        <Link
          href={nextHref}
          className={paginationButtonClass(true)}
          aria-label="Next page"
          prefetch
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
