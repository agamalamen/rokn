import Image from "next/image";
import Link from "next/link";
import {
  getCategoryBackgroundColor,
  getCategoryLabelColor,
} from "@/lib/shopify/category-colors";
import { shopifyImageUrl } from "@/lib/shopify/image";
import type { CategoryBrowseItem } from "@/lib/shopify/types";
import { getShopUrl } from "@/lib/shopify/vendor-collection";

type CategoryBrowseGridProps = {
  categories: CategoryBrowseItem[];
};

type CategoryCardProps = {
  category: CategoryBrowseItem;
  colorIndex: number;
};

function CategoryCard({ category, colorIndex }: CategoryCardProps) {
  const backgroundColor = getCategoryBackgroundColor(colorIndex);
  const labelColor = getCategoryLabelColor(backgroundColor);
  const previewSlots = [category.previewProducts[0], category.previewProducts[1]];

  return (
    <Link
      href={getShopUrl(category)}
      className="group flex aspect-[3/2] flex-col justify-between overflow-hidden rounded-3xl p-3.5 lg:aspect-[2/1]"
      style={{ backgroundColor }}
    >
      <h2
        className="text-base font-semibold leading-tight lg:text-xl"
        style={{ color: labelColor }}
      >
        {category.title}
      </h2>

      <div className="flex items-end justify-center gap-2">
        {previewSlots.map((product, index) => (
          <div
            key={product?.id ?? `placeholder-${index}`}
            className={`aspect-square w-[30%] overflow-hidden rounded-xl lg:w-[22%] motion-safe:transform-gpu motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:shadow-[0_14px_28px_-10px_rgba(0,0,0,0.45)] ${
              index === 0
                ? "motion-safe:group-hover:-translate-x-1 motion-safe:group-hover:-translate-y-2.5 motion-safe:group-hover:-rotate-3 motion-safe:group-hover:scale-105"
                : "motion-safe:delay-75 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-3.5 motion-safe:group-hover:rotate-3 motion-safe:group-hover:scale-105"
            }`}
          >
            {product?.featuredImage ? (
              <Image
                src={shopifyImageUrl(product.featuredImage.url, 240)}
                alt={
                  product.featuredImage.altText ??
                  `${category.title} product ${index + 1}`
                }
                width={240}
                height={240}
                sizes="(max-width: 640px) 40vw, 20vw"
                className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-110"
              />
            ) : category.image && index === 0 ? (
              <Image
                src={shopifyImageUrl(category.image.url, 240)}
                alt={category.image.altText ?? category.title}
                width={240}
                height={240}
                sizes="(max-width: 640px) 40vw, 20vw"
                className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-110"
              />
            ) : null}
          </div>
        ))}
      </div>
    </Link>
  );
}

export function CategoryBrowseGrid({ categories }: CategoryBrowseGridProps) {
  if (categories.length === 0) {
    return (
      <p className="mx-4 rounded-2xl bg-surface px-6 py-16 text-center text-sm text-muted sm:mx-6 lg:mx-8">
        No categories found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:px-8">
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          colorIndex={index}
        />
      ))}
    </div>
  );
}
