"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import {
  SelectFilterPill,
  type SelectFilterOption,
} from "@/components/select-filter-pill";
import type { ProductCard } from "@/lib/shopify/types";

type ShopFilteredProductsProps = {
  products: ProductCard[];
};

type PriceRangeOption = SelectFilterOption & {
  matches: (price: number) => boolean;
};

function getProductPrice(product: ProductCard): number {
  return Number.parseFloat(product.priceRange.minVariantPrice.amount);
}

function formatPriceAmount(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getPriceThresholds(maxPrice: number): number[] {
  if (maxPrice <= 30) {
    return [10, 20];
  }

  if (maxPrice <= 75) {
    return [25, 50];
  }

  if (maxPrice <= 150) {
    return [50, 100];
  }

  if (maxPrice <= 300) {
    return [50, 100, 200];
  }

  return [50, 100, 200, 500];
}

function buildTypeOptions(products: ProductCard[]): SelectFilterOption[] {
  const productTypes = [
    ...new Set(
      products
        .map((product) => product.productType.trim())
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));

  return [
    { id: "all", label: "All categories" },
    ...productTypes.map((productType) => ({
      id: productType,
      label: productType,
    })),
  ];
}

function buildPriceRangeOptions(products: ProductCard[]): PriceRangeOption[] {
  if (products.length === 0) {
    return [];
  }

  const currencyCode = products[0].priceRange.minVariantPrice.currencyCode;
  const prices = products.map(getProductPrice);
  const maxPrice = Math.max(...prices);
  const thresholds = getPriceThresholds(maxPrice);
  const format = (amount: number) => formatPriceAmount(amount, currencyCode);

  const options: PriceRangeOption[] = [
    { id: "all-prices", label: "All prices", matches: () => true },
  ];

  const firstThreshold = thresholds[0];
  if (prices.some((price) => price < firstThreshold)) {
    options.push({
      id: `under-${firstThreshold}`,
      label: `Under ${format(firstThreshold)}`,
      matches: (price) => price < firstThreshold,
    });
  }

  for (let index = 0; index < thresholds.length - 1; index += 1) {
    const min = thresholds[index];
    const max = thresholds[index + 1];

    if (prices.some((price) => price >= min && price < max)) {
      options.push({
        id: `${min}-${max}`,
        label: `${format(min)} – ${format(max)}`,
        matches: (price) => price >= min && price < max,
      });
    }
  }

  const lastThreshold = thresholds[thresholds.length - 1];
  if (prices.some((price) => price >= lastThreshold)) {
    options.push({
      id: `${lastThreshold}-plus`,
      label: `${format(lastThreshold)}+`,
      matches: (price) => price >= lastThreshold,
    });
  }

  return options;
}

function buildEmptyMessage(
  activeTypeFilter: string,
  activePriceFilter: string,
  typeOptions: SelectFilterOption[],
  priceOptions: PriceRangeOption[],
) {
  const typeLabel =
    typeOptions.find((option) => option.id === activeTypeFilter)?.label ?? null;
  const priceLabel =
    priceOptions.find((option) => option.id === activePriceFilter)?.label ??
    null;
  const hasTypeFilter = activeTypeFilter !== "all";
  const hasPriceFilter = activePriceFilter !== "all-prices";

  if (hasTypeFilter && hasPriceFilter && typeLabel && priceLabel) {
    return `No products found in ${typeLabel} at ${priceLabel}.`;
  }

  if (hasTypeFilter && typeLabel) {
    return `No products found in ${typeLabel}.`;
  }

  if (hasPriceFilter && priceLabel) {
    return `No products found at ${priceLabel}.`;
  }

  return "No products found.";
}

export function ShopFilteredProducts({ products }: ShopFilteredProductsProps) {
  const typeOptions = useMemo(() => buildTypeOptions(products), [products]);
  const priceOptions = useMemo(
    () => buildPriceRangeOptions(products),
    [products],
  );
  const [activeTypeFilter, setActiveTypeFilter] = useState("all");
  const [activePriceFilter, setActivePriceFilter] = useState("all-prices");

  const activePriceMatcher = useMemo(
    () =>
      priceOptions.find((option) => option.id === activePriceFilter)?.matches ??
      (() => true),
    [activePriceFilter, priceOptions],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesType =
        activeTypeFilter === "all" ||
        product.productType.trim() === activeTypeFilter;
      const matchesPrice = activePriceMatcher(getProductPrice(product));

      return matchesType && matchesPrice;
    });
  }, [activePriceMatcher, activeTypeFilter, products]);

  const showFilters = typeOptions.length > 1 || priceOptions.length > 1;

  return (
    <>
      {showFilters && (
        <div className="mb-6 flex flex-wrap gap-2 px-4 sm:px-6 lg:px-8">
          <SelectFilterPill
            label="All categories"
            options={typeOptions}
            selectedId={activeTypeFilter}
            defaultId="all"
            onChange={setActiveTypeFilter}
            menuLabel="Product category"
          />
          <SelectFilterPill
            label="Price"
            options={priceOptions}
            selectedId={activePriceFilter}
            defaultId="all-prices"
            onChange={setActivePriceFilter}
            menuLabel="Price range"
          />
        </div>
      )}
      <ProductGrid
        products={filteredProducts}
        emptyMessage={buildEmptyMessage(
          activeTypeFilter,
          activePriceFilter,
          typeOptions,
          priceOptions,
        )}
      />
    </>
  );
}
