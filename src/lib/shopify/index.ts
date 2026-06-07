import {
  SHOPIFY_API_VERSION,
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  isShopifyConfigured,
} from "@/lib/constants";
import {
  addToCartMutation,
  createCartMutation,
  getCartQuery,
  getCollectionByHandleQuery,
  getCollectionsQuery,
  getProductByHandleQuery,
  getProductsQuery,
  removeFromCartMutation,
  updateCartLineMutation,
} from "@/lib/shopify/queries";
import type { Cart, Collection, Product, ProductCard } from "@/lib/shopify/types";

type ShopifyFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
};

type UserError = { field: string[] | null; message: string };

function ensureConfigured() {
  if (!isShopifyConfigured()) {
    throw new Error(
      "Shopify is not configured. Add SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.local",
    );
  }
}

async function shopifyFetch<T>({
  query,
  variables,
  cache = "force-cache",
  tags,
}: ShopifyFetchOptions): Promise<T> {
  ensureConfigured();

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags ? { next: { tags } } : {}),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  if (!json.data) {
    throw new Error("No data returned from Shopify");
  }

  return json.data;
}

function assertNoUserErrors(
  userErrors: UserError[] | undefined,
  action: string,
) {
  if (userErrors?.length) {
    throw new Error(`${action}: ${userErrors[0].message}`);
  }
}

export async function getProducts(first = 12): Promise<ProductCard[]> {
  const data = await shopifyFetch<{
    products: { edges: { node: ProductCard }[] };
  }>({
    query: getProductsQuery,
    variables: { first },
    tags: ["products"],
  });

  return data.products.edges.map((edge) => edge.node);
}

export async function getProductByHandle(
  handle: string,
): Promise<Product | null> {
  const data = await shopifyFetch<{ product: Product | null }>({
    query: getProductByHandleQuery,
    variables: { handle },
    tags: [`product-${handle}`],
  });

  return data.product;
}

export async function getCollections(first = 12): Promise<Collection[]> {
  const data = await shopifyFetch<{
    collections: { edges: { node: Collection }[] };
  }>({
    query: getCollectionsQuery,
    variables: { first },
    tags: ["collections"],
  });

  return data.collections.edges.map((edge) => edge.node);
}

export async function getCollectionByHandle(
  handle: string,
  first = 24,
): Promise<(Collection & { products: ProductCard[] }) | null> {
  const data = await shopifyFetch<{
    collection: (Collection & { products: { edges: { node: ProductCard }[] } }) | null;
  }>({
    query: getCollectionByHandleQuery,
    variables: { handle, first },
    tags: [`collection-${handle}`],
  });

  if (!data.collection) {
    return null;
  }

  return {
    ...data.collection,
    products: data.collection.products.edges.map((edge) => edge.node),
  };
}

export async function createCart(
  lines?: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: Cart | null; userErrors: UserError[] };
  }>({
    query: createCartMutation,
    variables: { lines: lines ?? [] },
    cache: "no-store",
  });

  assertNoUserErrors(data.cartCreate.userErrors, "Create cart failed");

  if (!data.cartCreate.cart) {
    throw new Error("Create cart failed: no cart returned");
  }

  return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Cart | null }>({
    query: getCartQuery,
    variables: { cartId },
    cache: "no-store",
  });

  return data.cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: Cart | null; userErrors: UserError[] };
  }>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });

  assertNoUserErrors(data.cartLinesAdd.userErrors, "Add to cart failed");

  if (!data.cartLinesAdd.cart) {
    throw new Error("Add to cart failed: no cart returned");
  }

  return data.cartLinesAdd.cart;
}

export async function updateCartLine(
  cartId: string,
  lines: { id: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: Cart | null; userErrors: UserError[] };
  }>({
    query: updateCartLineMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });

  assertNoUserErrors(data.cartLinesUpdate.userErrors, "Update cart failed");

  if (!data.cartLinesUpdate.cart) {
    throw new Error("Update cart failed: no cart returned");
  }

  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: Cart | null; userErrors: UserError[] };
  }>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });

  assertNoUserErrors(data.cartLinesRemove.userErrors, "Remove from cart failed");

  if (!data.cartLinesRemove.cart) {
    throw new Error("Remove from cart failed: no cart returned");
  }

  return data.cartLinesRemove.cart;
}
