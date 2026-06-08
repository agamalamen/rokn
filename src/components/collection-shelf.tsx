import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import type { Collection } from "@/lib/shopify/types";
import { getShopUrl } from "@/lib/shopify/vendor-collection";

type CollectionShelfProps = {
  title: string;
  collections: Collection[];
  href?: string;
};

export function CollectionShelf({
  title,
  collections,
  href,
}: CollectionShelfProps) {
  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <SectionHeader title={title} href={href} />
      <div className="shelf-scroll flex gap-3 overflow-x-auto px-4 sm:gap-4 sm:px-6 lg:px-8">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={getShopUrl(collection)}
            className="group w-36 shrink-0 sm:w-44"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText ?? collection.title}
                  width={352}
                  height={440}
                  sizes="176px"
                  className="h-full w-full object-cover motion-safe:transform-gpu motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
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
    </section>
  );
}
