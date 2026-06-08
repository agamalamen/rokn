import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { isShopifyConfigured } from "@/lib/constants";
import {
  getCollectionMetaByHandle,
  getCollectionPage,
  getTotalCollectionPages,
} from "@/lib/shopify";
import { getShopUrl, isShopCollection } from "@/lib/shopify/vendor-collection";

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ after?: string; before?: string; page?: string }>;
};

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  if (!isShopifyConfigured()) {
    return { title: "Collection" };
  }

  const { handle } = await params;
  const collection = await getCollectionMetaByHandle(handle);

  if (!collection) {
    return { title: "Collection not found" };
  }

  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  if (!isShopifyConfigured()) {
    notFound();
  }

  const { handle } = await params;
  const { after, before, page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const collectionMeta = await getCollectionMetaByHandle(handle);

  if (!collectionMeta) {
    notFound();
  }

  if (isShopCollection(collectionMeta)) {
    redirect(getShopUrl(collectionMeta));
  }

  const [collectionPage, totalPages] = await Promise.all([
    getCollectionPage(handle, before ? { before } : { after: after ?? null }),
    getTotalCollectionPages(handle),
  ]);

  if (!collectionPage) {
    notFound();
  }

  return (
    <CollectionView
      collection={{
        ...collectionPage.collection,
        products: collectionPage.products,
      }}
      pagination={{
        basePath: `/collections/${handle}`,
        pageInfo: collectionPage.pageInfo,
        page: Math.min(page, totalPages),
        totalPages,
      }}
    />
  );
}
