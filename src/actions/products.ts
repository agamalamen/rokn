"use server";

import { getProductsPage } from "@/lib/shopify";

export async function loadMoreProducts(after: string) {
  return getProductsPage({ after });
}
