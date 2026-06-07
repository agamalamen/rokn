import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { isShopifyConfigured } from "@/lib/constants";
import { getCollections } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Collections",
};

export default async function CollectionsPage() {
  const collections = isShopifyConfigured() ? await getCollections() : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Collections</h1>
        <p className="mt-2 text-stone-600">
          Shop by category from your Shopify collections.
        </p>
      </div>

      {collections.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 px-6 py-16 text-center text-stone-500">
          No collections found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] bg-stone-100">
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText ?? collection.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-stone-400">
                    No image
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-medium text-stone-900">{collection.title}</h2>
                {collection.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-stone-600">
                    {collection.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
