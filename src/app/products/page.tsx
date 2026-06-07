import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-grid";
import { isShopifyConfigured } from "@/lib/constants";
import { getProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Shop",
};

export default async function ProductsPage() {
  const products = isShopifyConfigured() ? await getProducts(24) : [];

  return (
    <div className="py-6">
      <div className="mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">All products</h1>
        <p className="mt-1 text-sm text-muted">
          Browse the full catalog
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
