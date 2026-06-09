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
    <div className="py-6">
      <div className="mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">Your cart</h1>
        {lines.length > 0 && (
          <p className="mt-1 text-sm text-muted">
            {cart?.totalQuantity} {cart?.totalQuantity === 1 ? "item" : "items"}
          </p>
        )}
      </div>

      {lines.length === 0 ? (
        <div className="mx-4 rounded-2xl bg-surface px-6 py-16 text-center sm:mx-6 lg:mx-8">
          <p className="text-sm text-muted">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-cta px-6 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta-hover"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-3xl lg:px-8">
          <div className="divide-y divide-border rounded-2xl bg-surface">
            {lines.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Subtotal</span>
              {cart && <Price amount={cart.cost.subtotalAmount} />}
            </div>
            <p className="mt-2 text-xs text-muted">
              Taxes and shipping calculated at checkout.
            </p>
            {cart && (
              <div className="mt-5">
                <CheckoutButton checkoutUrl={cart.checkoutUrl} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
