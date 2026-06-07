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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{collection.title}</h1>
          {collection.description && (
            <p className="mt-4 max-w-2xl text-stone-600">{collection.description}</p>
          )}
        </div>
        {collection.image && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-stone-100">
            <Image
              src={collection.image.url}
              alt={collection.image.altText ?? collection.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
      </div>

      <ProductGrid products={collection.products} />
    </div>
  );
}
