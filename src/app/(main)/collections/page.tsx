import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { isShopifyConfigured } from "@/lib/constants";
import { getCollections } from "@/lib/shopify";
import { getShopUrl, isShopCollection } from "@/lib/shopify/vendor-collection";

export const metadata: Metadata = {
  title: "Collections",
};

export default async function CollectionsPage() {
  const allCollections = isShopifyConfigured() ? await getCollections() : [];
  const collections = allCollections.filter(
    (collection) => !isShopCollection(collection),
  );

  return (
    <div className="py-6">
      <div className="mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
        <p className="mt-1 text-sm text-muted">Shop by category</p>
      </div>

      {collections.length === 0 ? (
        <p className="mx-4 rounded-2xl bg-surface px-6 py-16 text-center text-sm text-muted sm:mx-6 lg:mx-8">
          No collections found.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={getShopUrl(collection)}
              className="group"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText ?? collection.title}
                    width={400}
                    height={500}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="h-full w-full object-cover motion-safe:transform-gpu motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    No image
                  </div>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
                {collection.title}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
