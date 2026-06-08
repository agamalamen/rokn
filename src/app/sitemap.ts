import type { MetadataRoute } from "next";
import { isShopifyConfigured } from "@/lib/constants";
import { getAllProductHandles, getCollections } from "@/lib/shopify";
import { getSiteUrl } from "@/lib/site-url";
import { getShopUrl } from "@/lib/shopify/vendor-collection";

export const revalidate = 3600;

function productPath(handle: string) {
  return `/products/${encodeURIComponent(handle)}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  if (!isShopifyConfigured()) {
    return entries;
  }

  const [productHandles, collections] = await Promise.all([
    getAllProductHandles(),
    getCollections(),
  ]);

  for (const handle of productHandles) {
    entries.push({
      url: `${baseUrl}${productPath(handle)}`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const collection of collections) {
    entries.push({
      url: `${baseUrl}${getShopUrl(collection)}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}
