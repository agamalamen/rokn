import Image from "next/image";
import Link from "next/link";
import { shopifyImageUrl } from "@/lib/shopify/image";
import type { Image as ShopifyImage } from "@/lib/shopify/types";

type VendorHeaderAction = {
  label: string;
  href: string;
};

type ProductVendorHeaderProps = {
  vendor: string;
  image?: ShopifyImage | null;
  action?: VendorHeaderAction;
};

function vendorInitials(vendor: string) {
  return vendor
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProductVendorHeader({
  vendor,
  image,
  action,
}: ProductVendorHeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="rounded-full bg-gradient-to-r from-[#5433eb] to-[#2563eb] p-[2px]">
            <div className="relative h-11 w-11 overflow-hidden rounded-full bg-white">
              {image ? (
                <Image
                  src={shopifyImageUrl(image.url, 88)}
                  alt={image.altText ?? vendor}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-[10px] font-bold tracking-wide text-foreground">
                    {vendorInitials(vendor)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold text-foreground">
              {vendor}
            </p>
          </div>
        </div>

        {action && (
          <Link
            href={action.href}
            className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
            prefetch
          >
            {action.label}
          </Link>
        )}
      </div>
    </header>
  );
}
