"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartCount } from "@/components/cart-count-provider";

export function HeaderCartLink() {
  const { count: itemCount } = useCartCount();

  return (
    <Link
      href="/cart"
      className="relative hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface sm:inline-flex"
      aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
      prefetch
    >
      <ShoppingCart className="h-6 w-6 text-foreground" strokeWidth={1.75} />
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
