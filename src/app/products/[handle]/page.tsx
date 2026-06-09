import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import { ProductPurchaseOptions } from "@/components/product-purchase-options";
import { isShopifyConfigured } from "@/lib/constants";
import { getProductByHandle, getProductHeaderByHandle } from "@/lib/shopify";
import type { Image } from "@/lib/shopify/types";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export const revalidate = 300;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  if (!isShopifyConfigured()) {
    return { title: "Product" };
  }

  const { handle } = await params;
  const product = await getProductHeaderByHandle(handle);

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

  const variants = product.variants.edges.map(({ node }) => node);
  const images: Image[] = product.images.edges.map(({ node }) => node);
  const carouselImages =
    images.length > 0
      ? images
      : product.featuredImage
        ? [product.featuredImage]
        : [];

  return (
    <div className="pb-6 lg:mx-auto lg:max-w-7xl">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12 lg:px-8">
        <ProductImageCarousel images={carouselImages} title={product.title} />

        <div className="flex flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:px-0 lg:py-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              {product.title}
            </h1>
          </div>

          {variants.length > 0 && (
            <ProductPurchaseOptions variants={variants} />
          )}

          {product.description && (
            <div
              className="prose prose-sm max-w-none text-muted lg:prose-base"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
