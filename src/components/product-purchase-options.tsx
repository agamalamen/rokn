"use client";

import { useMemo, useState, useTransition } from "react";
import { addItemToCart } from "@/actions/cart";
import { Price } from "@/components/price";
import type { Money, ProductVariant } from "@/lib/shopify/types";

type ProductPurchaseOptionsProps = {
  variants: ProductVariant[];
};

function getInitialOptions(variants: ProductVariant[]) {
  const firstAvailable =
    variants.find((variant) => variant.availableForSale) ?? variants[0];

  return Object.fromEntries(
    firstAvailable.selectedOptions.map((option) => [option.name, option.value]),
  );
}

function findVariant(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>,
) {
  return (
    variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => selectedOptions[option.name] === option.value,
      ),
    ) ?? variants[0]
  );
}

function isOptionValueAvailable(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>,
  optionName: string,
  optionValue: string,
) {
  return variants.some(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.every((option) => {
        if (option.name === optionName) {
          return option.value === optionValue;
        }

        return selectedOptions[option.name] === option.value;
      }),
  );
}

export function ProductPurchaseOptions({
  variants,
}: ProductPurchaseOptionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => getInitialOptions(variants),
  );
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const optionGroups = useMemo(() => {
    const groups = new Map<string, Set<string>>();

    for (const variant of variants) {
      for (const option of variant.selectedOptions) {
        if (option.value === "Default Title") {
          continue;
        }

        if (!groups.has(option.name)) {
          groups.set(option.name, new Set());
        }

        groups.get(option.name)?.add(option.value);
      }
    }

    return [...groups.entries()].map(([name, values]) => ({
      name,
      values: [...values],
    }));
  }, [variants]);

  const selectedVariant = useMemo(
    () => findVariant(variants, selectedOptions),
    [selectedOptions, variants],
  );

  const showVariantOptions =
    optionGroups.length > 0 &&
    !(variants.length === 1 && variants[0].title === "Default Title");

  function handleOptionChange(optionName: string, optionValue: string) {
    setSelectedOptions((current) => ({
      ...current,
      [optionName]: optionValue,
    }));
  }

  function handleAddToCart() {
    startTransition(async () => {
      await addItemToCart(selectedVariant.id, quantity);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Price amount={selectedVariant.price} className="text-base" />

      {showVariantOptions &&
        optionGroups.map((group) => (
          <div key={group.name}>
            <p className="mb-2 text-sm font-semibold text-foreground">
              {group.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const selected = selectedOptions[group.name] === value;
                const available = isOptionValueAvailable(
                  variants,
                  selectedOptions,
                  group.name,
                  value,
                );

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleOptionChange(group.name, value)}
                    disabled={!available}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      selected
                        ? "bg-foreground text-white"
                        : "bg-surface text-foreground hover:bg-border"
                    }`}
                    aria-pressed={selected}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">Quantity</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1 || isPending}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-lg font-medium text-foreground transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[1.5rem] text-center text-base font-medium">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.min(99, current + 1))}
            disabled={quantity >= 99 || isPending}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-lg font-medium text-foreground transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!selectedVariant.availableForSale || isPending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {isPending
          ? "Adding..."
          : selectedVariant.availableForSale
            ? "Add to cart"
            : "Sold out"}
      </button>
    </div>
  );
}
