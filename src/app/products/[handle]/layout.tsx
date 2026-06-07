import { notFound } from "next/navigation";
import { ProductVendorHeader } from "@/components/product-vendor-header";
import { isShopifyConfigured } from "@/lib/constants";
import { getProductByHandle } from "@/lib/shopify";
import {
  findVendorCollection,
  getShopSlug,
} from "@/lib/shopify/vendor-collection";

type ProductLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ handle: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProductLayout({
  children,
  params,
}: ProductLayoutProps) {
  if (!isShopifyConfigured()) {
    notFound();
  }

  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const vendor = product.vendor || "Rokn";
  const collections = product.collections.edges.map((edge) => edge.node);
  const shopCollection = findVendorCollection(vendor, collections);
  const shopSlug = shopCollection ? getShopSlug(shopCollection) : undefined;

  return (
    <>
      <ProductVendorHeader
        vendor={vendor}
        action={
          shopSlug
            ? { label: "View shop", href: `/${shopSlug}` }
            : undefined
        }
      />
      <main className="flex-1 pb-nav">{children}</main>
    </>
  );
}
