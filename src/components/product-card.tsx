import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/price";
import { shopifyImageUrl } from "@/lib/shopify/image";
import type { ProductCard as ProductCardType } from "@/lib/shopify/types";

type ProductCardProps = {
  product: ProductCardType;
  variant?: "grid" | "shelf";
  singleLineTitle?: boolean;
  priority?: boolean;
};

export function ProductCard({
  product,
  variant = "grid",
  singleLineTitle = false,
  priority = false,
}: ProductCardProps) {
  const image = product.featuredImage;
  const isShelf = variant === "shelf";
  const imageWidth = isShelf ? 352 : 400;

  return (
    <Link
      href={`/products/${product.handle}`}
      className={`group flex flex-col ${isShelf ? "w-36 shrink-0 sm:w-44" : ""}`}
      prefetch={priority}
    >
      <div
        className={`overflow-hidden bg-surface ${
          isShelf ? "aspect-square rounded-2xl" : "aspect-square rounded-2xl"
        }`}
      >
        {image ? (
          <Image
            src={shopifyImageUrl(image.url, imageWidth)}
            alt={image.altText ?? product.title}
            width={imageWidth}
            height={imageWidth}
            priority={priority}
            sizes={isShelf ? "176px" : "(max-width: 768px) 50vw, 25vw"}
            className={`h-full w-full object-cover ${
              priority
                ? ""
                : "motion-safe:transform-gpu motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
            }`}
          />
        ) : (
          <div className="flex aspect-square items-center justify-center text-xs text-muted">
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
