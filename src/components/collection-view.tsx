import { CatalogPagination } from "@/components/catalog-pagination";
import { ProductGrid } from "@/components/product-grid";
import { ShopFilteredProducts } from "@/components/shop-filtered-products";
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
