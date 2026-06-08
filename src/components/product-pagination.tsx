import { CatalogPagination } from "@/components/catalog-pagination";
import type { PageInfo } from "@/lib/shopify/types";

type ProductPaginationProps = {
  pageInfo: PageInfo;
  page: number;
  totalPages: number;
};

export function ProductPagination({
  pageInfo,
  page,
  totalPages,
}: ProductPaginationProps) {
  return (
    <CatalogPagination
      basePath="/products"
      pageInfo={pageInfo}
      page={page}
      totalPages={totalPages}
    />
  );
}
