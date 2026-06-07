"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

type HeaderCartLinkProps = {
  itemCount: number;
};

export function HeaderCartLink({ itemCount }: HeaderCartLinkProps) {
  return (
    <Link
      href="/cart"
      className="relative hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface sm:inline-flex"
      aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
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
