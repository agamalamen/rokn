import { CategoryCollectionCarousel } from "@/components/category-collection-carousel";
import { ProductGrid } from "@/components/product-grid";
import { ProductShelf } from "@/components/product-shelf";
import { SectionHeader } from "@/components/section-header";
import { isShopifyConfigured } from "@/lib/constants";
import { getCollections, getProducts } from "@/lib/shopify";
import { isShopCollection } from "@/lib/shopify/vendor-collection";

export const revalidate = 300;

export default async function HomePage() {
  const shopifyConfigured = isShopifyConfigured();
  const [products, allCollections] = shopifyConfigured
    ? await Promise.all([getProducts(12), getCollections()])
    : [[], []];

  const categoryCollections = allCollections.filter(
    (collection) => !isShopCollection(collection),
  );

  const featured = products.slice(0, 8);
  const trending = products.slice(4, 12);

  return (
    <div className="pb-4">
      <CategoryCollectionCarousel collections={categoryCollections} />

      <ProductShelf
        title="Featured for you"
        products={featured}
        href="/products"
        singleLineTitle
        priorityCount={1}
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
          priorityCount={0}
          emptyMessage={
            shopifyConfigured
              ? "No products found in your Shopify store yet."
              : "Connect Shopify to load products from your store."
          }
        />
      </section>
    </div>
  );
}
