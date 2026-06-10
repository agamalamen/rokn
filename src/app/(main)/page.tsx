import { CategoryCollectionCarousel } from "@/components/category-collection-carousel";
import { ProductShelf } from "@/components/product-shelf";
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
    <div className="pb-4 sm:px-8 lg:px-12">
      <CategoryCollectionCarousel collections={categoryCollections} />

      {trending.length > 0 && (
        <ProductShelf
          title="Trending now"
          products={trending}
          href="/products"
          singleLineTitle
          priorityCount={1}
        />
      )}

      <ProductShelf
        title="Rokn picks"
        products={featured}
        href="/products"
        singleLineTitle
      />

      <ProductShelf
        title="All products"
        products={products}
        href="/products"
        singleLineTitle
        trailingLink={{ label: "Browse everything", href: "/products" }}
      />
    </div>
  );
}
