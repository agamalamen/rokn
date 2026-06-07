import { notFound } from "next/navigation";
import { ProductVendorHeader } from "@/components/product-vendor-header";
import { isShopifyConfigured } from "@/lib/constants";
import { getShopCollectionBySlug } from "@/lib/shopify";

type ShopLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ handle: string }>;
};

export const dynamic = "force-dynamic";

export default async function ShopLayout({
  children,
  params,
}: ShopLayoutProps) {
  if (!isShopifyConfigured()) {
    notFound();
  }

  const { handle: shopSlug } = await params;
  const collection = await getShopCollectionBySlug(shopSlug);

  if (!collection) {
    notFound();
  }

  return (
    <>
      <ProductVendorHeader
        vendor={collection.title}
        action={{ label: "Message seller", href: "/about" }}
      />
      <main className="flex-1 pb-nav">{children}</main>
    </>
  );
}
