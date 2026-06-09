"use client";

import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const inputClassName =
  "h-14 w-full rounded-full border border-border/60 bg-white pl-6 pr-16 text-base text-foreground outline-none ring-1 ring-border placeholder:text-base placeholder:text-muted transition-shadow focus:border-accent/30 focus:ring-2 focus:ring-accent/40";

const submitClassName =
  "absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-accent-hover";

function SearchField() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultQuery =
    pathname === "/search" ? (searchParams.get("q") ?? "") : "";

  return (
    <form action="/search" method="get" className="w-full">
      <div className="relative mx-auto w-full sm:max-w-xl">
        <label className="sr-only" htmlFor="header-search">
          Search products
        </label>
        <input
          id="header-search"
          type="search"
          name="q"
          defaultValue={defaultQuery}
          placeholder="What are you shopping for today?"
          className={inputClassName}
        />
        <button type="submit" className={submitClassName} aria-label="Search">
          <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.25} />
        </button>
      </div>
    </form>
  );
}

function SearchFallback() {
  return (
    <div className="relative mx-auto w-full sm:max-w-xl">
      <input
        type="search"
        placeholder="What are you shopping for today?"
        className={inputClassName}
        disabled
      />
      <span className={submitClassName} aria-hidden>
        <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </span>
    </div>
  );
}

export function HeaderSearch() {
  return (
    <div className="w-full sm:flex-1">
      <Suspense fallback={<SearchFallback />}>
        <SearchField />
      </Suspense>
    </div>
  );
}
