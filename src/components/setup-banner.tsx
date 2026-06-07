import { isShopifyConfigured } from "@/lib/constants";

export function SetupBanner() {
  if (isShopifyConfigured()) {
    return null;
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="mx-auto max-w-7xl">
        Shopify is not configured yet. Copy <code className="rounded bg-amber-100 px-1.5 py-0.5">.env.example</code> to{" "}
        <code className="rounded bg-amber-100 px-1.5 py-0.5">.env.local</code> and add your Storefront API credentials.
      </p>
    </div>
  );
}
