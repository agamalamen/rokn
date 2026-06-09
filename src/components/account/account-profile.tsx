import Image from "next/image";
import { Price } from "@/components/price";
import { shopifyImageUrl } from "@/lib/shopify/image";
import type { CustomerAccountProfile } from "@/lib/shopify/customer-account/types";

type AccountProfileProps = {
  customer: CustomerAccountProfile;
};

function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function AccountProfile({ customer }: AccountProfileProps) {
  const orders = customer.orders.edges.map((edge) => edge.node);
  const email = customer.emailAddress?.emailAddress;

  return (
    <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-3xl lg:px-8">
      <div className="rounded-2xl bg-surface p-5">
        <h1 className="text-2xl font-bold tracking-tight">Your account</h1>
        <p className="mt-1 text-sm text-muted">{customer.displayName}</p>
        {email && <p className="mt-1 text-sm text-muted">{email}</p>}

        <form action="/api/customer-auth/logout" method="post" className="mt-5">
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-white"
          >
            Sign out
          </button>
        </form>
      </div>

      <section className="mt-6">
        <h2 className="mb-4 text-lg font-bold tracking-tight">Orders</h2>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-surface px-6 py-12 text-center">
            <p className="text-sm text-muted">You don&apos;t have any orders yet.</p>
            <a
              href="/products"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              Start shopping
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const lineItems = order.lineItems.edges.map((edge) => edge.node);

              return (
                <article
                  key={order.id}
                  className="rounded-2xl bg-surface p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {order.name}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {formatOrderDate(order.processedAt)}
                      </p>
                    </div>
                    <Price amount={order.totalPrice} className="text-sm" />
                  </div>

                  {lineItems.length > 0 && (
                    <div className="mt-4 flex flex-col gap-3">
                      {lineItems.map((lineItem, index) => (
                        <div
                          key={`${order.id}-${lineItem.title}-${index}`}
                          className="flex items-center gap-3"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                            {lineItem.image ? (
                              <Image
                                src={shopifyImageUrl(lineItem.image.url, 112)}
                                alt={
                                  lineItem.image.altText ?? lineItem.title
                                }
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {lineItem.title}
                            </p>
                            <p className="text-xs text-muted">
                              Qty {lineItem.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
