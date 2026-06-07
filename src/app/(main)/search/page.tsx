import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-grid";
import { isShopifyConfigured } from "@/lib/constants";
import { searchProducts } from "@/lib/shopify";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
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
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const products =
    query && isShopifyConfigured() ? await searchProducts(query, 24) : [];

  return (
    <div className="py-6">
      <div className="mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {query && (
          <p className="mt-1 text-sm text-muted">
            {products.length}{" "}
            {products.length === 1 ? "product" : "products"} found
          </p>
        )}
      </div>

      {!query ? (
        <p className="mx-4 rounded-2xl bg-surface px-6 py-16 text-center text-sm text-muted sm:mx-6 lg:mx-8">
          Enter a search term to find products.
        </p>
      ) : (
        <ProductGrid
          products={products}
          singleLineTitle
          emptyMessage={`No products found for "${query}".`}
        />
      )}
    </div>
  );
}
