import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-grid";
import { isShopifyConfigured } from "@/lib/constants";
import { getCollectionByHandle } from "@/lib/shopify";

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
};

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

      <div className="mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">{collection.title}</h1>
        {collection.description && (
          <p className="mt-2 text-sm text-muted">{collection.description}</p>
        )}
      </div>

      <ProductGrid products={collection.products} />
    </div>
  );
}
