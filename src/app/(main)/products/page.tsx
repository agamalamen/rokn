import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-grid";
import { ProductPagination } from "@/components/product-pagination";
import { isShopifyConfigured } from "@/lib/constants";
import { getProductsPage, getTotalProductPages } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Shop",
};

type ProductsPageProps = {
  searchParams: Promise<{ after?: string; before?: string; page?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { after, before, page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const emptyPageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  };

  const [{ products, pageInfo }, totalPages] = isShopifyConfigured()
    ? await Promise.all([
        getProductsPage(
          before ? { before } : { after: after ?? null },
        ),
        getTotalProductPages(),
      ])
    : [{ products: [], pageInfo: emptyPageInfo }, 1];

  return (
    <div className="py-6">
      <div className="mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">All products</h1>
        <p className="mt-1 text-sm text-muted">
          Browse the full catalog
        </p>
      </div>
      <ProductGrid products={products} />
      <ProductPagination
        pageInfo={pageInfo}
        page={Math.min(page, totalPages)}
        totalPages={totalPages}
      />
    </div>
  );
}
