import { ProductGrid } from "@/components/product-grid";
import { ProductShelf } from "@/components/product-shelf";
import { SectionHeader } from "@/components/section-header";
import { isShopifyConfigured } from "@/lib/constants";
import { getProducts } from "@/lib/shopify";

export default async function HomePage() {
  const products = isShopifyConfigured() ? await getProducts(12) : [];

  const featured = products.slice(0, 8);
  const trending = products.slice(4, 12);

  return (
    <div className="pb-4">
      <ProductShelf
        title="Featured for you"
        products={featured}
        href="/products"
        singleLineTitle
      />

      {trending.length > 0 && (
        <ProductShelf
          title="Trending now"
          products={trending}
          href="/products"
          singleLineTitle
        />
      )}

      <section className="py-6">
        <SectionHeader title="All products" href="/products" />
        <ProductGrid
          products={products.slice(0, 4)}
          singleLineTitle
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
