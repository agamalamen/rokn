import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { isShopifyConfigured } from "@/lib/constants";
import { getCollectionByHandle } from "@/lib/shopify";
import { getShopUrl, isShopCollection } from "@/lib/shopify/vendor-collection";

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  if (!isShopifyConfigured()) {
    return { title: "Collection" };
  }

  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    return { title: "Collection not found" };
  }

  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  if (!isShopifyConfigured()) {
    notFound();
  }

  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    notFound();
  }

  if (isShopCollection(collection)) {
    redirect(getShopUrl(collection));
  }

  return <CollectionView collection={collection} />;
}
