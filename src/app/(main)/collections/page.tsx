import type { Metadata } from "next";
import { CategoryBrowseGrid } from "@/components/category-browse-grid";
import { isShopifyConfigured } from "@/lib/constants";
import { getCategoryBrowseCollections } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Browse categories",
};

export default async function CollectionsPage() {
  const categories = isShopifyConfigured()
    ? await getCategoryBrowseCollections()
    : [];

  return (
    <div className="py-6">
      <div className="mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">Browse categories</h1>
      </div>

      <CategoryBrowseGrid categories={categories} />
    </div>
  );
}
