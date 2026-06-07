"use client";

import { useTransition } from "react";
import { addItemToCart } from "@/actions/cart";

type AddToCartButtonProps = {
  variantId: string;
  availableForSale: boolean;
};

export function AddToCartButton({
  variantId,
  availableForSale,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await addItemToCart(variantId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!availableForSale || isPending}
      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
    >
      {isPending ? "Adding..." : availableForSale ? "Add to cart" : "Sold out"}
    </button>
  );
}
