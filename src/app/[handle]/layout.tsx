import { notFound } from "next/navigation";
import { ProductVendorHeader } from "@/components/product-vendor-header";
import { isShopifyConfigured } from "@/lib/constants";
import { getShopCollectionMetaBySlug } from "@/lib/shopify";

type ShopLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ handle: string }>;
};

export default async function ShopLayout({
  children,
  params,
}: ShopLayoutProps) {
  if (!isShopifyConfigured()) {
    notFound();
  }

  const { handle: shopSlug } = await params;
  const collection = await getShopCollectionMetaBySlug(shopSlug);

  if (!collection) {
    notFound();
  }

  return (
    <>
      <ProductVendorHeader
        vendor={collection.title}
        image={collection.image}
        action={{ label: "Message seller", href: "/about" }}
      />
      <main className="flex-1 pb-nav">{children}</main>
    </>
  );
}
