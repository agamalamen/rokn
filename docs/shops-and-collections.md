# Shops vs collections

Rokn uses Shopify **collections** for two different purposes: generic catalog categories and per-seller shops. Those two types get **different URL patterns**. A redirect prevents the same collection from being indexed at two URLs.

## Data model

In Shopify, both “New Arrivals” and “Acme Boutique” are collections. Rokn splits them by handle:

| Type | Example handle | Example title | Public URL |
| --- | --- | --- | --- |
| Generic collection | `new-arrivals` | New Arrivals | `/collections/new-arrivals` |
| Shop (vendor) | `acme-boutique` | Acme Boutique | `/acme-boutique` |

A **shop** is not a separate Shopify resource. It is a collection that represents a seller’s product set. Product pages resolve the seller via `findVendorCollection()` and link to the shop using a slug derived from the **collection title**, not the Shopify handle or vendor username.

Implementation: `src/lib/shopify/vendor-collection.ts`

## URL rules

Generic collections are identified by handle in `GENERIC_COLLECTION_HANDLES`:

- `all-products`
- `new-arrivals`
- `deals-discounts`
- `gifts`
- `weekly-collection`

Everything else is treated as a shop.

```ts
isShopCollection(collection)  // true if handle NOT in generic list
getShopSlug(collection)       // slugifyShopName(collection.title)
getShopUrl(collection)        // shop → /{slug}, generic → /collections/{handle}
```

Shop slug rules (`slugifyShopName`):

- Lowercase
- Strip `&`
- Non-alphanumeric runs become `-`
- Trim leading/trailing `-`

Example: `"Acme Boutique"` → `/acme-boutique`

## Why two URL shapes exist

1. **Shop pages** use a Shop.app-style layout: top-level URL, vendor header, filter pills, no main site header.
2. **Generic collections** stay under `/collections/…` as browse-by-category pages.
3. **“View shop” on product pages** links to `/{shopSlug}`, not `/collections/{handle}`, so the URL matches the visible shop name.

Routes:

| Route | Purpose |
| --- | --- |
| `src/app/[handle]/` | Shop page (vendor collection by slug) |
| `src/app/(main)/collections/[handle]/` | Generic collection, or redirect for shops |

## The redirect (duplicate URL problem)

Shopify always exposes a collection at `/collections/{handle}`. Rokn’s preferred URL for shops is `/{slug}`.

Without a redirect, the same products could appear at:

- `/collections/acme-boutique`
- `/acme-boutique`

That creates **duplicate content** for search engines and splits ranking signals.

**Fix:** `src/app/(main)/collections/[handle]/page.tsx` redirects shop collections to `getShopUrl()` before rendering:

```ts
if (isShopCollection(collectionMeta)) {
  redirect(getShopUrl(collectionMeta));
}
```

Flow:

```
/collections/acme-boutique  →  redirect  →  /acme-boutique
/collections/new-arrivals   →  render collection page (no redirect)
/collections                →  links use getShopUrl() (shops already point to /{slug})
/products/…                 →  “View shop” links to /{shopSlug}
```

## Where links are built

Always use `getShopUrl()` or `getShopSlug()` — do not hardcode `/collections/{handle}` for shop collections.

| Location | Behavior |
| --- | --- |
| `src/app/(main)/collections/page.tsx` | Grid links via `getShopUrl()` |
| `src/components/collection-shelf.tsx` | Shelf links via `getShopUrl()` |
| `src/app/products/[handle]/layout.tsx` | “View shop” → `/{shopSlug}` |
| `src/app/(main)/collections/[handle]/page.tsx` | Redirect if shop |

Shop resolution on product pages: `findVendorCollection(vendor, product.collections)` matches by handle, title, keywords, then first non-generic collection.

## SEO notes

- The redirect is intentional canonicalization: one collection → one public URL.
- Generic collections and shops should not both be linked in navigation for the same seller collection; upstream links already prefer `getShopUrl()`.
- Crawlers hitting `/collections/{shop-handle}` still reach the shop via redirect; the canonical shop URL is `/{slug}`.

## Edge cases to watch

1. **Slug collisions** — Two collection titles that slugify to the same string (e.g. `"Acme & Co"` and `"Acme Co"`) map to one slug. The cached slug map in `getShopHandleBySlug()` keeps the last write from catalog order; avoid duplicate titles.
2. **Title changes in Shopify** — Renaming a shop changes the slug. Old URLs (`/old-name`) will 404 unless you add redirects for previous slugs.
3. **Generic list maintenance** — New site-wide collections (e.g. `sale`) must be added to `GENERIC_COLLECTION_HANDLES` or they will be treated as shops and get a top-level URL.
4. **Arabic / non-Latin titles** — `slugifyShopName` strips non-ASCII characters; shop URLs may be empty or ambiguous for some titles. Product handles still use `normalizeHandle()` separately.

## Related code

- `src/lib/shopify/vendor-collection.ts` — classification, slugs, URLs, vendor matching
- `src/lib/shopify/index.ts` — `getShopHandleBySlug`, `getShopCollectionMetaBySlug`, slug map cache
- `src/app/[handle]/layout.tsx` — shop vendor header
- `src/app/[handle]/page.tsx` — shop product grid + pagination
