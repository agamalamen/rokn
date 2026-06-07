import type { Metadata } from "next";
import Link from "next/link";
import { fetchCart } from "@/actions/cart";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CheckoutButton } from "@/components/cart/checkout-button";
import { Price } from "@/components/price";

export const metadata: Metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const cart = await fetchCart();
  const lines = cart?.lines.edges.map((edge) => edge.node) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>

      {lines.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-stone-300 px-6 py-16 text-center">
          <p className="text-stone-600">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-stone-200 bg-white px-6">
            {lines.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-medium">Order summary</h2>
            <div className="mt-4 flex items-center justify-between border-b border-stone-200 pb-4">
              <span className="text-stone-600">Subtotal</span>
              {cart && <Price amount={cart.cost.subtotalAmount} />}
            </div>
            <p className="mt-4 text-sm text-stone-500">
              Taxes and shipping are calculated at checkout.
            </p>
            {cart && (
              <div className="mt-6">
                <CheckoutButton checkoutUrl={cart.checkoutUrl} />
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
