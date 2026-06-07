import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Price } from "@/components/price";
import { isShopifyConfigured } from "@/lib/constants";
import { getProductByHandle } from "@/lib/shopify";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  if (!isShopifyConfigured()) {
    return { title: "Product" };
  }

  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  if (!isShopifyConfigured()) {
    notFound();
  }

  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const defaultVariant = product.variants.edges[0]?.node;
  const image = product.featuredImage;

  return (
    <div className="pb-6">
      <div className="relative aspect-square bg-surface sm:mx-auto sm:mt-6 sm:max-w-lg sm:overflow-hidden sm:rounded-2xl">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            No image available
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5 px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-lg lg:px-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {product.title}
          </h1>
          <div className="mt-2">
            <Price amount={product.priceRange.minVariantPrice} className="text-base" />
          </div>
        </div>

        {product.description && (
          <div
            className="prose prose-sm max-w-none text-muted"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}

        {defaultVariant && (
          <AddToCartButton
            variantId={defaultVariant.id}
            availableForSale={defaultVariant.availableForSale}
          />
        )}

        {product.variants.edges.length > 1 && (
          <div className="rounded-2xl bg-surface p-4">
            <p className="text-sm font-semibold text-foreground">Variants</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              {product.variants.edges.map(({ node }) => (
                <li key={node.id}>
                  {node.title} — {node.availableForSale ? "In stock" : "Sold out"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
