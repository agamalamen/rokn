import Image from "next/image";
import { CatalogPagination } from "@/components/catalog-pagination";
import { ProductGrid } from "@/components/product-grid";
import { ShopFilteredProducts } from "@/components/shop-filtered-products";
import { shopifyImageUrl } from "@/lib/shopify/image";
import type { Collection, PageInfo, ProductCard } from "@/lib/shopify/types";

type CollectionViewProps = {
  collection: Collection & { products: ProductCard[] };
  hideTitle?: boolean;
  showFilterPills?: boolean;
  pagination?: {
    basePath: string;
    pageInfo: PageInfo;
    page: number;
    totalPages?: number;
    query?: Record<string, string | undefined>;
  };
};

export function CollectionView({
  collection,
  hideTitle = false,
  showFilterPills = false,
  pagination,
}: CollectionViewProps) {
  return (
    <div className="py-6">
      {collection.image && !showFilterPills && (
        <div className="relative mx-4 mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-surface sm:mx-6 lg:mx-8">
          <Image
            src={shopifyImageUrl(collection.image.url, 1200)}
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

      {pagination && (
        <CatalogPagination
          basePath={pagination.basePath}
          pageInfo={pagination.pageInfo}
          page={pagination.page}
          totalPages={pagination.totalPages}
          query={pagination.query}
        />
      )}
    </div>
  );
}
