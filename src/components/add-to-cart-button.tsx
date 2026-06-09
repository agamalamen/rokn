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
      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-cta px-6 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta-hover disabled:cursor-not-allowed disabled:bg-neutral-300"
    >
      {isPending ? "Adding..." : availableForSale ? "Add to cart" : "Sold out"}
    </button>
  );
}
