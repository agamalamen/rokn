import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { isShopifyConfigured } from "@/lib/constants";
import { getShopCollectionBySlug } from "@/lib/shopify";

type ShopPageProps = {
  params: Promise<{ handle: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ShopPageProps): Promise<Metadata> {
  if (!isShopifyConfigured()) {
    return { title: "Shop" };
  }

  const { handle: shopSlug } = await params;
  const collection = await getShopCollectionBySlug(shopSlug);

  if (!collection) {
    return { title: "Shop not found" };
  }

  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
  if (!isShopifyConfigured()) {
    notFound();
  }

  const { handle: shopSlug } = await params;
  const collection = await getShopCollectionBySlug(shopSlug);

  if (!collection) {
    notFound();
  }

  return <CollectionView collection={collection} />;
}
