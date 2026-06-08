export const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ?? "";
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";
export const SHOPIFY_API_VERSION =
  process.env.SHOPIFY_API_VERSION ?? "2025-01";

export const CART_COOKIE_NAME = "cartId";
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
export const PRODUCTS_PAGE_SIZE = 24;
export const COLLECTION_PRODUCTS_PAGE_SIZE = 24;
export const SEARCH_PAGE_SIZE = 24;
export const CATALOG_REVALIDATE_SECONDS = 60 * 60;
export const PAGE_REVALIDATE_SECONDS = 300;

export function isShopifyConfigured(): boolean {
  return Boolean(SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_ACCESS_TOKEN);
}
