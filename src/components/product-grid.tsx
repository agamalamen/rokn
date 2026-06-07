import { ProductCard } from "@/components/product-card";
import type { ProductCard as ProductCardType } from "@/lib/shopify/types";

type ProductGridProps = {
  products: ProductCardType[];
  emptyMessage?: string;
  singleLineTitle?: boolean;
  cardVariant?: "grid" | "shelf";
};

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
  singleLineTitle = false,
  cardVariant = "grid",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="mx-4 rounded-2xl bg-surface px-6 py-16 text-center text-sm text-muted sm:mx-6 lg:mx-8">
        {emptyMessage}
      </p>
    );
  }

  const isShelf = cardVariant === "shelf";

  return (
    <div
      className={
        isShelf
          ? "grid grid-cols-[repeat(auto-fill,9rem)] gap-3 px-4 sm:grid-cols-[repeat(auto-fill,11rem)] sm:gap-4 sm:px-6 lg:px-8"
          : "grid grid-cols-2 gap-x-3 gap-y-6 px-4 sm:grid-cols-3 sm:gap-x-4 sm:px-6 lg:grid-cols-4 lg:px-8"
      }
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={cardVariant}
          singleLineTitle={singleLineTitle}
        />
      ))}
    </div>
  );
}
