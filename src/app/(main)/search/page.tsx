import type { Metadata } from "next";
import { CatalogPagination } from "@/components/catalog-pagination";
import { ProductGrid } from "@/components/product-grid";
import { isShopifyConfigured } from "@/lib/constants";
import { searchProductsPage } from "@/lib/shopify";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    after?: string;
    before?: string;
    page?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();

  if (!query) {
    return { title: "Search" };
  }

  return { title: `Search: ${query}` };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, after, before, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const emptyPageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  };

  const { products, pageInfo } =
    query && isShopifyConfigured()
      ? await searchProductsPage({
          query,
          ...(before ? { before } : { after: after ?? null }),
        })
      : { products: [], pageInfo: emptyPageInfo };

  return (
    <div className="py-6 lg:px-12">
      <div className="mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {query && (
          <p className="mt-1 text-sm text-muted">
            {products.length}{" "}
            {products.length === 1 ? "product" : "products"} on this page
          </p>
        )}
      </div>

      {!query ? (
        <p className="mx-4 rounded-2xl bg-surface px-6 py-16 text-center text-sm text-muted sm:mx-6 lg:mx-8">
          Enter a search term to find products.
        </p>
      ) : (
        <>
          <ProductGrid
            products={products}
            singleLineTitle
            emptyMessage={`No products found for "${query}".`}
          />
          <CatalogPagination
            basePath="/search"
            pageInfo={pageInfo}
            page={page}
            query={{ q: query }}
          />
        </>
      )}
    </div>
  );
}
