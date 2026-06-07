"use client";

import { Search } from "lucide-react";

export function HeaderSearch() {
  return (
    <div className="w-full sm:flex-1">
      <label className="relative mx-auto block w-full sm:max-w-md">
        <span className="sr-only">Search products</span>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          strokeWidth={1.75}
          aria-hidden
        />
        <input
          type="search"
          placeholder="Search products"
          className="h-10 w-full rounded-full bg-surface pl-10 pr-4 text-sm text-foreground placeholder:text-muted outline-none ring-accent/30 transition-shadow focus:ring-2"
          readOnly
        />
      </label>
    </div>
  );
}
