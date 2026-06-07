import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Rokn and our curated approach to everyday living.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
            Our story
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Thoughtful pieces for the home you love
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-stone-600">
            Rokn is a curated storefront for everyday essentials — mugs, trays,
            bags, and home accents chosen with care. We believe the objects you
            live with should feel intentional, beautiful, and made to last.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">What we stand for</h2>
            <p className="mt-4 text-stone-600">
              Every product in our catalog is selected for quality, character, and
              everyday usefulness. We focus on pieces that bring warmth to your
              space — whether it is a morning coffee ritual or a gift for someone
              special.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">How we work</h2>
            <p className="mt-4 text-stone-600">
              Rokn is built on Shopify and delivered through a fast, modern
              storefront. That means secure checkout, reliable fulfillment, and a
              shopping experience designed to be simple from browse to buy.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight">Start exploring</h2>
          <p className="mt-4 max-w-xl text-stone-600">
            Browse our full catalog or shop by collection to find your next
            favorite piece.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
            >
              Shop all products
            </Link>
            <Link
              href="/collections"
              className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 px-6 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
            >
              Browse collections
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
