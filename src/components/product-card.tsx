import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/price";
import type { ProductCard } from "@/lib/shopify/types";

type ProductCardProps = {
  product: ProductCard;
};

export function ProductCard({ product }: ProductCardProps) {
  const image = product.featuredImage;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-medium text-stone-900">{product.title}</h3>
        <Price amount={product.priceRange.minVariantPrice} />
      </div>
    </Link>
  );
}
