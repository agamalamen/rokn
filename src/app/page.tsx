import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { isShopifyConfigured } from "@/lib/constants";
import { getProducts } from "@/lib/shopify";

export default async function HomePage() {
  const products = isShopifyConfigured() ? await getProducts(8) : [];

  return (
    <div>
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
            New season
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Curated essentials for everyday living
          </h1>
          <p className="max-w-xl text-lg text-stone-600">
            Discover products from your Shopify store, delivered through a fast
            headless storefront built with Next.js.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
            >
              Shop all
            </Link>
            <Link
              href="/collections"
              className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 px-6 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
            >
              Browse collections
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Featured products</h2>
            <p className="mt-2 text-stone-600">Best sellers from your Shopify catalog</p>
          </div>
          <Link href="/products" className="text-sm font-medium text-stone-900 hover:underline">
            View all
          </Link>
        </div>
        <ProductGrid
          products={products}
          emptyMessage={
            isShopifyConfigured()
              ? "No products found in your Shopify store yet."
              : "Connect Shopify to load products from your store."
          }
        />
      </section>
    </div>
  );
}
