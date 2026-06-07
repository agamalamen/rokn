import Image from "next/image";
import Link from "next/link";
import { removeItemFromCart, updateItemQuantity } from "@/actions/cart";
import { Price } from "@/components/price";
import type { CartLine } from "@/lib/shopify/types";

type CartLineItemProps = {
  line: CartLine;
};

export function CartLineItem({ line }: CartLineItemProps) {
  const { merchandise } = line;
  const image = merchandise.product.featuredImage;

  return (
    <div className="flex gap-3 p-4">
      <Link
        href={`/products/${merchandise.product.handle}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white"
      >
        {image ? (
          <Image
            src={image.url}
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
          <form action={updateItemQuantity.bind(null, line.id, line.quantity - 1)}>
            <button
              type="submit"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-medium text-foreground transition-colors hover:bg-border"
              aria-label="Decrease quantity"
            >
              −
            </button>
          </form>
          <span className="min-w-[1.25rem] text-center text-sm font-medium">
            {line.quantity}
          </span>
          <form action={updateItemQuantity.bind(null, line.id, line.quantity + 1)}>
            <button
              type="submit"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-medium text-foreground transition-colors hover:bg-border"
              aria-label="Increase quantity"
            >
              +
            </button>
          </form>
          <form action={removeItemFromCart.bind(null, line.id)} className="ml-auto">
            <button
              type="submit"
              className="text-xs font-medium text-muted transition-colors hover:text-foreground"
            >
              Remove
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
