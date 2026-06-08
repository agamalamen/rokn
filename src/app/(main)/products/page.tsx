import type { Metadata } from "next";
import { InfiniteProductGrid } from "@/components/infinite-product-grid";
import { isShopifyConfigured } from "@/lib/constants";
import { getProductsPage } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Shop",
};

export default async function ProductsPage() {
  const emptyPageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  };

  const { products, pageInfo } = isShopifyConfigured()
    ? await getProductsPage()
    : { products: [], pageInfo: emptyPageInfo };

  return (
    <div className="py-6">
      <div className="mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">All products</h1>
        <p className="mt-1 text-sm text-muted">Browse the full catalog</p>
      </div>
      <InfiniteProductGrid
        initialProducts={products}
        initialPageInfo={pageInfo}
        emptyMessage={
          isShopifyConfigured()
            ? "No products found in your Shopify store yet."
            : "Connect Shopify to load products from your store."
        }
      />
    </div>
  );
}
