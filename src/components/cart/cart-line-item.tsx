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
    <div className="flex gap-4 border-b border-stone-200 py-6">
      <Link
        href={`/products/${merchandise.product.handle}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? merchandise.product.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/products/${merchandise.product.handle}`}
              className="font-medium text-stone-900 hover:underline"
            >
              {merchandise.product.title}
            </Link>
            {merchandise.title !== "Default Title" && (
              <p className="mt-1 text-sm text-stone-500">{merchandise.title}</p>
            )}
          </div>
          <Price amount={merchandise.price} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <form action={updateItemQuantity.bind(null, line.id, line.quantity - 1)}>
            <button
              type="submit"
              className="rounded-full border border-stone-200 px-3 py-1 text-sm hover:bg-stone-50"
              aria-label="Decrease quantity"
            >
              −
            </button>
          </form>
          <span className="text-sm font-medium">{line.quantity}</span>
          <form action={updateItemQuantity.bind(null, line.id, line.quantity + 1)}>
            <button
              type="submit"
              className="rounded-full border border-stone-200 px-3 py-1 text-sm hover:bg-stone-50"
              aria-label="Increase quantity"
            >
              +
            </button>
          </form>
          <form action={removeItemFromCart.bind(null, line.id)} className="ml-auto">
            <button
              type="submit"
              className="text-sm text-stone-500 transition-colors hover:text-stone-900"
            >
              Remove
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
