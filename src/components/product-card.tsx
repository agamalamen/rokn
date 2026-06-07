import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/price";
import type { ProductCard as ProductCardType } from "@/lib/shopify/types";

type ProductCardProps = {
  product: ProductCardType;
  variant?: "grid" | "shelf";
  singleLineTitle?: boolean;
};

export function ProductCard({
  product,
  variant = "grid",
  singleLineTitle = false,
}: ProductCardProps) {
  const image = product.featuredImage;
  const isShelf = variant === "shelf";

  return (
    <Link
      href={`/products/${product.handle}`}
      className={`group flex flex-col ${isShelf ? "w-36 shrink-0 sm:w-44" : ""}`}
    >
      <div
        className={`relative overflow-hidden bg-surface ${
          isShelf ? "aspect-square rounded-2xl" : "aspect-square rounded-2xl"
        }`}
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            sizes={isShelf ? "176px" : "(max-width: 768px) 50vw, 25vw"}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            No image
          </div>
        )}
      </div>

      <div className={`flex flex-col gap-0.5 ${isShelf ? "mt-2" : "mt-2.5 px-0.5"}`}>
        <h3
          className={`min-w-0 text-sm font-medium leading-snug text-foreground ${
            singleLineTitle ? "truncate" : "line-clamp-2"
          }`}
        >
          {product.title}
        </h3>
        <Price amount={product.priceRange.minVariantPrice} className="text-sm" />
      </div>
    </Link>
  );
}
