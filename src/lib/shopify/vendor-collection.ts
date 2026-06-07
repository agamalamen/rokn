const GENERIC_COLLECTION_HANDLES = new Set([
  "all-products",
  "new-arrivals",
  "deals-discounts",
  "gifts",
  "weekly-collection",
]);

export type VendorCollection = {
  handle: string;
  title: string;
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

export function isShopCollection(
  collection: Pick<VendorCollection, "handle">,
) {
  return !GENERIC_COLLECTION_HANDLES.has(collection.handle);
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

  return (
    collections.find(
      (collection) => !GENERIC_COLLECTION_HANDLES.has(collection.handle),
    ) ?? null
  );
}
