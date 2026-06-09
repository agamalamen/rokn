import type { Image } from "@/lib/shopify/types";

const GENERIC_COLLECTION_HANDLES = [
  "accessories",
  "ahmed-s-stuff",
  "all-products",
  "arabic-calligraphy",
  "bags-handhelds",
  "candles-scents",
  "customizable-products",
  "deals-discounts",
  "gifts",
  "home-decor",
  "jewelry",
  "kitchen-dining",
  "new-arrivals",
  "other",
  "palestine",
  "weekly-collection",
] as const;

function normalizeGenericSlug(slug: string) {
  return slug
    .toLowerCase()
    .replace(/-and-/g, "-")
    .replace(/^-|-$/g, "");
}

const NORMALIZED_GENERIC_SLUGS = new Set(
  GENERIC_COLLECTION_HANDLES.map(normalizeGenericSlug),
);

export type VendorCollection = {
  handle: string;
  title: string;
  image?: Image | null;
};

export function slugifyShopName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function slugifyVendor(vendor: string) {
  return slugifyShopName(vendor);
}

export function isGenericCollection(
  collection: Pick<VendorCollection, "handle" | "title">,
) {
  const candidates = [
    collection.handle,
    slugifyShopName(collection.title),
  ].map(normalizeGenericSlug);

  return candidates.some((candidate) => NORMALIZED_GENERIC_SLUGS.has(candidate));
}

export function isShopCollection(
  collection: Pick<VendorCollection, "handle" | "title">,
) {
  return !isGenericCollection(collection);
}

export function getShopSlug(collection: Pick<VendorCollection, "title">) {
  return slugifyShopName(collection.title);
}

export function getShopUrl(collection: VendorCollection) {
  if (isShopCollection(collection)) {
    return `/${getShopSlug(collection)}`;
  }

  return `/collections/${collection.handle}`;
}

export function findVendorCollection(
  vendor: string,
  collections: VendorCollection[],
): VendorCollection | null {
  if (!collections.length) {
    return null;
  }

  const vendorSlug = slugifyVendor(vendor);
  const vendorLower = vendor.toLowerCase().replace(/\s+/g, " ").trim();

  const byHandle = collections.find((collection) => collection.handle === vendorSlug);
  if (byHandle) {
    return byHandle;
  }

  const byTitle = collections.find(
    (collection) =>
      collection.title.toLowerCase().replace(/\s+/g, " ").trim() === vendorLower,
  );
  if (byTitle) {
    return byTitle;
  }

  const vendorWords = vendorLower.split(/\s+/).filter((word) => word.length > 2);
  const byWord = collections.find((collection) => {
    const titleLower = collection.title.toLowerCase();
    return vendorWords.some((word) => titleLower.includes(word));
  });
  if (byWord) {
    return byWord;
  }

  return collections.find((collection) => isShopCollection(collection)) ?? null;
}
