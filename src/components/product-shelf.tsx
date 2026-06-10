import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import type { ProductCard as ProductCardType } from "@/lib/shopify/types";

type ProductShelfProps = {
  title: string;
  products: ProductCardType[];
  href?: string;
  singleLineTitle?: boolean;
  priorityCount?: number;
  trailingLink?: {
    label: string;
    href: string;
  };
};

export function ProductShelf({
  title,
  products,
  href,
  singleLineTitle = false,
  priorityCount = 0,
  trailingLink,
}: ProductShelfProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <SectionHeader title={title} href={href} />
      <div className="shelf-scroll flex gap-3 overflow-x-auto px-4 sm:gap-4 sm:px-6 lg:mx-8 lg:px-0">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="shelf"
            singleLineTitle={singleLineTitle}
            priority={index < priorityCount}
          />
        ))}

        {trailingLink && (
          <Link
            href={trailingLink.href}
            className="flex aspect-square w-36 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl bg-surface text-sm font-semibold text-foreground transition-colors hover:bg-border sm:w-44"
            prefetch
          >
            {trailingLink.label}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-white">
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
