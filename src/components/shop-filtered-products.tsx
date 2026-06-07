"use client";

import { useMemo, useState } from "react";
import { FilterPills } from "@/components/filter-pills";
import { ProductGrid } from "@/components/product-grid";
import type { ProductCard } from "@/lib/shopify/types";

type ShopFilteredProductsProps = {
  products: ProductCard[];
};

function buildFilters(products: ProductCard[]) {
  const productTypes = [
    ...new Set(
      products
        .map((product) => product.productType.trim())
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));

  return [
    { id: "all", label: "All" },
    ...productTypes.map((productType) => ({
      id: productType,
      label: productType,
    })),
  ];
}

export function ShopFilteredProducts({ products }: ShopFilteredProductsProps) {
  const filters = useMemo(() => buildFilters(products), [products]);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") {
      return products;
    }

    return products.filter(
      (product) => product.productType.trim() === activeFilter,
    );
  }, [activeFilter, products]);

  return (
    <>
      <FilterPills
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <ProductGrid
        products={filteredProducts}
        emptyMessage={
          activeFilter === "all"
            ? "No products found."
            : `No products found in ${activeFilter}.`
        }
      />
    </>
  );
}
