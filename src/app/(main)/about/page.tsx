import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Rokn and our curated approach to everyday living.",
};

export default function AboutPage() {
  return (
    <div className="py-6">
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Thoughtful pieces for everyday living
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Rokn is a curated storefront for everyday essentials — mugs, trays,
          bags, and home accents chosen with care. We believe the objects you
          live with should feel intentional, beautiful, and made to last.
        </p>
      </div>

      <div className="mt-10 space-y-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-lg font-semibold">What we stand for</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Every product in our catalog is selected for quality, character, and
            everyday usefulness. We focus on pieces that bring warmth to your
            space.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">How we work</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Rokn is built on Shopify and delivered through a fast, modern
            storefront — secure checkout, reliable fulfillment, and a shopping
            experience designed to be simple from browse to buy.
          </p>
        </div>
      </div>

      <div className="mt-10 px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          Start shopping
        </Link>
      </div>
    </div>
  );
}
