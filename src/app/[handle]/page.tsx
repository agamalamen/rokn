import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { isShopifyConfigured } from "@/lib/constants";
import {
  getShopCollectionMetaBySlug,
  getShopCollectionPageBySlug,
  getShopHandleBySlug,
  getTotalCollectionPages,
} from "@/lib/shopify";

type ShopPageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ after?: string; before?: string; page?: string }>;
};

export async function generateMetadata({
  params,
}: ShopPageProps): Promise<Metadata> {
  if (!isShopifyConfigured()) {
    return { title: "Shop" };
  }

  const { handle: shopSlug } = await params;
  const collection = await getShopCollectionMetaBySlug(shopSlug);

  if (!collection) {
    return { title: "Shop not found" };
  }

  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  if (!isShopifyConfigured()) {
    notFound();
  }

  const { handle: shopSlug } = await params;
  const { after, before, page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const collectionHandle = await getShopHandleBySlug(shopSlug);

  if (!collectionHandle) {
    notFound();
  }

  const [collectionPage, totalPages] = await Promise.all([
    getShopCollectionPageBySlug(
      shopSlug,
      before ? { before } : { after: after ?? null },
    ),
    getTotalCollectionPages(collectionHandle),
  ]);

  if (!collectionPage) {
    notFound();
  }

  return (
    <div className="lg:px-12">
      <CollectionView
        collection={{
          ...collectionPage.collection,
          products: collectionPage.products,
        }}
        hideTitle
        showFilterPills
        pagination={{
          basePath: `/${shopSlug}`,
          pageInfo: collectionPage.pageInfo,
          page: Math.min(page, totalPages),
          totalPages,
        }}
      />
    </div>
  );
}
