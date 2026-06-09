import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import type { ProductCard as ProductCardType } from "@/lib/shopify/types";

type ProductShelfProps = {
  title: string;
  products: ProductCardType[];
  href?: string;
  singleLineTitle?: boolean;
  priorityCount?: number;
};

export function ProductShelf({
  title,
  products,
  href,
  singleLineTitle = false,
  priorityCount = 0,
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
      </div>
    </section>
  );
}
