import { notFound } from "next/navigation";
import { ProductVendorHeader } from "@/components/product-vendor-header";
import { isShopifyConfigured } from "@/lib/constants";
import { getProductHeaderByHandle } from "@/lib/shopify";
import {
  findVendorCollection,
  getShopSlug,
} from "@/lib/shopify/vendor-collection";

type ProductLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ handle: string }>;
};

export default async function ProductLayout({
  children,
  params,
}: ProductLayoutProps) {
  if (!isShopifyConfigured()) {
    notFound();
  }

  const { handle } = await params;
  const product = await getProductHeaderByHandle(handle);

  if (!product) {
    notFound();
  }

  const vendor = product.vendor || "Rokn";
  const collections = product.collections.edges.map((edge) => edge.node);
  const shopCollection = findVendorCollection(vendor, collections);
  const shopSlug = shopCollection ? getShopSlug(shopCollection) : undefined;
  const shopName = shopCollection?.title ?? vendor;

  return (
    <>
      <ProductVendorHeader
        vendor={shopName}
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
