import Image from "next/image";
import { ProductGrid } from "@/components/product-grid";
import { ShopFilteredProducts } from "@/components/shop-filtered-products";
import type { Collection, ProductCard } from "@/lib/shopify/types";

type CollectionViewProps = {
  collection: Collection & { products: ProductCard[] };
  hideTitle?: boolean;
  showFilterPills?: boolean;
};

export function CollectionView({
  collection,
  hideTitle = false,
  showFilterPills = false,
}: CollectionViewProps) {
  return (
    <div className="py-6">
      {collection.image && (
        <div className="relative mx-4 mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-surface sm:mx-6 lg:mx-8">
          <Image
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {!hideTitle && (
        <div className="mb-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight">{collection.title}</h1>
          {collection.description && (
            <p className="mt-2 text-sm text-muted">{collection.description}</p>
          )}
        </div>
      )}

      {hideTitle && collection.description && (
        <div className="mb-6 px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted">{collection.description}</p>
        </div>
      )}

      {showFilterPills ? (
        <ShopFilteredProducts products={collection.products} />
      ) : (
        <ProductGrid products={collection.products} />
      )}
    </div>
  );
}
