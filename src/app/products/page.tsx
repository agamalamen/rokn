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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">All products</h1>
        <p className="mt-2 text-stone-600">
          Browse the full catalog from your Shopify store.
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
