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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-stone-100">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone-400">
              No image available
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{product.title}</h1>
            <div className="mt-4">
              <Price amount={product.priceRange.minVariantPrice} />
            </div>
          </div>

          {product.description && (
            <div
              className="prose prose-stone max-w-none text-stone-600"
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
            <div className="rounded-2xl border border-stone-200 bg-white p-4">
              <p className="text-sm font-medium text-stone-900">Variants</p>
              <ul className="mt-3 space-y-2 text-sm text-stone-600">
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
    </div>
  );
}
