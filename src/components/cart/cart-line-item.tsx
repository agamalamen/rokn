"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  removeItemFromCart,
  updateItemQuantity,
} from "@/actions/cart";
import { useCartCount } from "@/components/cart-count-provider";
import { Price } from "@/components/price";
import { shopifyImageUrl } from "@/lib/shopify/image";
import type { CartLine } from "@/lib/shopify/types";

type CartLineItemProps = {
  line: CartLine;
};

export function CartLineItem({ line }: CartLineItemProps) {
  const router = useRouter();
  const { setCount } = useCartCount();
  const [isPending, startTransition] = useTransition();
  const { merchandise } = line;
  const image = merchandise.product.featuredImage;

  function handleQuantityChange(nextQuantity: number) {
    startTransition(async () => {
      const totalQuantity = await updateItemQuantity(line.id, nextQuantity);
      setCount(totalQuantity);
      router.refresh();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const totalQuantity = await removeItemFromCart(line.id);
      setCount(totalQuantity);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-3 p-4">
      <Link
        href={`/products/${merchandise.product.handle}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white"
        prefetch
      >
        {image ? (
          <Image
            src={shopifyImageUrl(image.url, 160)}
            alt={image.altText ?? merchandise.product.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${merchandise.product.handle}`}
              className="line-clamp-2 text-sm font-medium text-foreground hover:text-accent"
              prefetch
            >
              {merchandise.product.title}
            </Link>
            {merchandise.title !== "Default Title" && (
              <p className="mt-0.5 text-xs text-muted">{merchandise.title}</p>
            )}
          </div>
          <Price amount={merchandise.price} className="shrink-0 text-sm" />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleQuantityChange(line.quantity - 1)}
            disabled={isPending}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-medium text-foreground transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[1.25rem] text-center text-sm font-medium">
            {line.quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(line.quantity + 1)}
            disabled={isPending}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-medium text-foreground transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="ml-auto text-xs font-medium text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
