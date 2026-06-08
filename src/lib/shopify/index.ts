import { unstable_cache } from "next/cache";
import { cache } from "react";
import {
  SHOPIFY_API_VERSION,
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  CATALOG_REVALIDATE_SECONDS,
  COLLECTION_PRODUCTS_PAGE_SIZE,
  PAGE_REVALIDATE_SECONDS,
  PRODUCTS_PAGE_SIZE,
  SEARCH_PAGE_SIZE,
  isShopifyConfigured,
} from "@/lib/constants";
import {
  addToCartMutation,
  createCartMutation,
  getCartQuery,
  getCollectionByHandleQuery,
  getCollectionMetaByHandleQuery,
  getCollectionsQuery,
  getProductByHandleQuery,
  getProductHeaderByHandleQuery,
  getProductsQuery,
  removeFromCartMutation,
  searchProductsQuery,
  updateCartLineMutation,
} from "@/lib/shopify/queries";
import type {
  Cart,
  Collection,
  CollectionPageResult,
  PageInfo,
  Product,
  ProductCard,
  ProductHeader,
  ProductsPageResult,
  SearchPageResult,
} from "@/lib/shopify/types";
import { slugifyShopName } from "@/lib/shopify/vendor-collection";

type ShopifyFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
};

type UserError = { field: string[] | null; message: string };

type CollectionPageOptions = {
  first?: number;
  after?: string | null;
  before?: string | null;
};

type SearchPageOptions = {
  query: string;
  first?: number;
  after?: string | null;
  before?: string | null;
};

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
  revalidate,
  tags,
}: ShopifyFetchOptions): Promise<T> {
  ensureConfigured();

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const nextOptions: { tags?: string[]; revalidate?: number | false } = {};

  if (tags) {
    nextOptions.tags = tags;
  }

  if (revalidate !== undefined) {
    nextOptions.revalidate = revalidate;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(Object.keys(nextOptions).length ? { next: nextOptions } : {}),
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

function catalogFetch<T>(
  options: Omit<ShopifyFetchOptions, "cache" | "revalidate">,
): Promise<T> {
  return shopifyFetch({
    ...options,
    cache: "force-cache",
    revalidate: PAGE_REVALIDATE_SECONDS,
  });
}

function assertNoUserErrors(
  userErrors: UserError[] | undefined,
  action: string,
) {
  if (userErrors?.length) {
    throw new Error(`${action}: ${userErrors[0].message}`);
  }
}

function normalizeHandle(handle: string): string {
  try {
    return decodeURIComponent(handle);
  } catch {
    return handle;
  }
}

function handleCacheTag(prefix: string, handle: string): string {
  return `${prefix}-${encodeURIComponent(normalizeHandle(handle))}`;
}

export async function getProducts(first = 12): Promise<ProductCard[]> {
  const data = await shopifyFetch<{
    products: { edges: { node: ProductCard }[] };
  }>({
    query: getProductsQuery,
    variables: { first, after: null, last: null, before: null },
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: ["products"],
  });

  return data.products.edges.map((edge) => edge.node);
}

type GetProductsPageOptions = {
  first?: number;
  after?: string | null;
  before?: string | null;
};

export async function getProductsPage({
  first = PRODUCTS_PAGE_SIZE,
  after = null,
  before = null,
}: GetProductsPageOptions = {}): Promise<ProductsPageResult> {
  const variables = before
    ? { first: null, after: null, last: first, before }
    : { first, after, last: null, before: null };

  const data = await shopifyFetch<{
    products: {
      edges: { node: ProductCard }[];
      pageInfo: PageInfo;
    };
  }>({
    query: getProductsQuery,
    variables,
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: ["products"],
  });

  return {
    products: data.products.edges.map((edge) => edge.node),
    pageInfo: data.products.pageInfo,
  };
}

async function fetchAllProductHandles(): Promise<string[]> {
  const handles: string[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const { products, pageInfo } = await getProductsPage({
      first: 250,
      after: cursor,
    });

    handles.push(...products.map((product) => product.handle));
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  return handles;
}

export async function getTotalProductPages(
  pageSize = PRODUCTS_PAGE_SIZE,
): Promise<number> {
  return getCachedTotalProductPages(pageSize);
}

async function countTotalProductPages(pageSize: number): Promise<number> {
  let totalProducts = 0;
  let cursor: string | null = null;
  let hasNextPage = true;

  type ProductsCountResponse = {
    products: {
      edges: { node: { id: string } }[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };

  while (hasNextPage) {
    const data: ProductsCountResponse = await shopifyFetch<ProductsCountResponse>({
      query: getProductsQuery,
      variables: { first: 250, after: cursor, last: null, before: null },
      revalidate: CATALOG_REVALIDATE_SECONDS,
      tags: ["products"],
    });

    totalProducts += data.products.edges.length;
    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return Math.max(1, Math.ceil(totalProducts / pageSize));
}

const getCachedTotalProductPages = unstable_cache(
  countTotalProductPages,
  ["shopify-total-product-pages"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: ["products"],
  },
);

export const getAllProductHandles = unstable_cache(
  fetchAllProductHandles,
  ["shopify-all-product-handles"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: ["products"],
  },
);

export async function searchProducts(
  query: string,
  first = SEARCH_PAGE_SIZE,
): Promise<ProductCard[]> {
  const result = await searchProductsPage({ query, first });
  return result.products;
}

export async function searchProductsPage({
  query,
  first = SEARCH_PAGE_SIZE,
  after = null,
  before = null,
}: SearchPageOptions): Promise<SearchPageResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      products: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }

  const variables = before
    ? { query: trimmed, first: null, after: null, last: first, before }
    : { query: trimmed, first, after, last: null, before: null };

  const data = await shopifyFetch<{
    search: {
      edges: { node: ProductCard }[];
      pageInfo: PageInfo;
    };
  }>({
    query: searchProductsQuery,
    variables,
    cache: "no-store",
  });

  return {
    products: data.search.edges.map((edge) => edge.node),
    pageInfo: data.search.pageInfo,
  };
}

export const getProductHeaderByHandle = cache(async function getProductHeaderByHandle(
  handle: string,
): Promise<ProductHeader | null> {
  const normalizedHandle = normalizeHandle(handle);
  const data = await catalogFetch<{ product: ProductHeader | null }>({
    query: getProductHeaderByHandleQuery,
    variables: { handle: normalizedHandle },
    tags: [handleCacheTag("product", normalizedHandle)],
  });

  return data.product;
});

export const getProductByHandle = cache(async function getProductByHandle(
  handle: string,
): Promise<Product | null> {
  const normalizedHandle = normalizeHandle(handle);
  const data = await catalogFetch<{ product: Product | null }>({
    query: getProductByHandleQuery,
    variables: { handle: normalizedHandle },
    tags: [handleCacheTag("product", normalizedHandle)],
  });

  return data.product;
});

type CollectionsPageResponse = {
  collections: {
    edges: { node: Collection }[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

async function fetchAllCollections(): Promise<Collection[]> {
  const collections: Collection[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data: CollectionsPageResponse = await shopifyFetch({
      query: getCollectionsQuery,
      variables: { first: 250, after: cursor },
      revalidate: CATALOG_REVALIDATE_SECONDS,
      tags: ["collections"],
    });

    collections.push(...data.collections.edges.map((edge) => edge.node));
    hasNextPage = data.collections.pageInfo.hasNextPage;
    cursor = data.collections.pageInfo.endCursor;
  }

  return collections;
}

const getCachedCollectionsCatalog = unstable_cache(
  fetchAllCollections,
  ["shopify-collections-catalog"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: ["collections"],
  },
);

async function buildShopSlugMap(): Promise<Record<string, string>> {
  const collections = await getCachedCollectionsCatalog();
  const map: Record<string, string> = {};

  for (const collection of collections) {
    map[slugifyShopName(collection.title)] = collection.handle;
  }

  return map;
}

const getCachedShopSlugMap = unstable_cache(
  buildShopSlugMap,
  ["shopify-shop-slug-map"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: ["collections"],
  },
);

export async function getShopHandleBySlug(shopSlug: string): Promise<string | null> {
  const normalizedSlug = slugifyShopName(normalizeHandle(shopSlug));
  const slugMap = await getCachedShopSlugMap();
  return slugMap[normalizedSlug] ?? null;
}

export async function getCollections(first?: number): Promise<Collection[]> {
  const collections = await getCachedCollectionsCatalog();
  return first === undefined ? collections : collections.slice(0, first);
}

export const getCollectionMetaByHandle = cache(async function getCollectionMetaByHandle(
  handle: string,
): Promise<Collection | null> {
  const normalizedHandle = normalizeHandle(handle);
  const data = await catalogFetch<{ collection: Collection | null }>({
    query: getCollectionMetaByHandleQuery,
    variables: { handle: normalizedHandle },
    tags: [handleCacheTag("collection", normalizedHandle)],
  });

  return data.collection;
});

export const getCollectionPage = cache(async function getCollectionPage(
  handle: string,
  {
    first = COLLECTION_PRODUCTS_PAGE_SIZE,
    after = null,
    before = null,
  }: CollectionPageOptions = {},
): Promise<CollectionPageResult | null> {
  const normalizedHandle = normalizeHandle(handle);
  const variables = before
    ? { handle: normalizedHandle, first: null, after: null, last: first, before }
    : { handle: normalizedHandle, first, after, last: null, before: null };

  const data = await catalogFetch<{
    collection:
      | (Collection & {
          products: {
            edges: { node: ProductCard }[];
            pageInfo: PageInfo;
          };
        })
      | null;
  }>({
    query: getCollectionByHandleQuery,
    variables,
    tags: [handleCacheTag("collection", normalizedHandle)],
  });

  if (!data.collection) {
    return null;
  }

  return {
    collection: {
      id: data.collection.id,
      handle: data.collection.handle,
      title: data.collection.title,
      description: data.collection.description,
      image: data.collection.image,
    },
    products: data.collection.products.edges.map((edge) => edge.node),
    pageInfo: data.collection.products.pageInfo,
  };
});

export async function getTotalCollectionPages(
  handle: string,
  pageSize = COLLECTION_PRODUCTS_PAGE_SIZE,
): Promise<number> {
  return getCachedCollectionTotalPages(handle, pageSize);
}

async function countCollectionProductPages(
  handle: string,
  pageSize: number,
): Promise<number> {
  const normalizedHandle = normalizeHandle(handle);
  let totalProducts = 0;
  let cursor: string | null = null;
  let hasNextPage = true;

  type CollectionCountResponse = {
    collection: {
      products: {
        edges: { node: { id: string } }[];
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        };
      };
    } | null;
  };

  while (hasNextPage) {
    const data: CollectionCountResponse = await catalogFetch<CollectionCountResponse>({
      query: getCollectionByHandleQuery,
      variables: {
        handle: normalizedHandle,
        first: 250,
        after: cursor,
        last: null,
        before: null,
      },
      tags: [handleCacheTag("collection", normalizedHandle)],
    });

    if (!data.collection) {
      return 1;
    }

    totalProducts += data.collection.products.edges.length;
    hasNextPage = data.collection.products.pageInfo.hasNextPage;
    cursor = data.collection.products.pageInfo.endCursor;
  }

  return Math.max(1, Math.ceil(totalProducts / pageSize));
}

function getCachedCollectionTotalPages(handle: string, pageSize: number) {
  const normalizedHandle = normalizeHandle(handle);

  return unstable_cache(
    () => countCollectionProductPages(normalizedHandle, pageSize),
    ["shopify-collection-total-pages", normalizedHandle, String(pageSize)],
    {
      revalidate: CATALOG_REVALIDATE_SECONDS,
      tags: [
        "collections",
        handleCacheTag("collection", normalizedHandle),
      ],
    },
  )();
}

/** @deprecated Use getCollectionPage or getCollectionMetaByHandle instead. */
export const getCollectionByHandle = cache(async function getCollectionByHandle(
  handle: string,
  first = COLLECTION_PRODUCTS_PAGE_SIZE,
): Promise<(Collection & { products: ProductCard[] }) | null> {
  const page = await getCollectionPage(handle, { first });

  if (!page) {
    return null;
  }

  return {
    ...page.collection,
    products: page.products,
  };
});

export const getShopCollectionMetaBySlug = cache(async function getShopCollectionMetaBySlug(
  shopSlug: string,
): Promise<Collection | null> {
  const handle = await getShopHandleBySlug(shopSlug);

  if (!handle) {
    return null;
  }

  return getCollectionMetaByHandle(handle);
});

export const getShopCollectionPageBySlug = cache(
  async function getShopCollectionPageBySlug(
    shopSlug: string,
    options: CollectionPageOptions = {},
  ): Promise<CollectionPageResult | null> {
    const handle = await getShopHandleBySlug(shopSlug);

    if (!handle) {
      return null;
    }

    return getCollectionPage(handle, options);
  },
);

export const getShopCollectionBySlug = cache(async function getShopCollectionBySlug(
  shopSlug: string,
) {
  const page = await getShopCollectionPageBySlug(shopSlug);

  if (!page) {
    return null;
  }

  return {
    ...page.collection,
    products: page.products,
  };
});

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
