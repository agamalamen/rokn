export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: Money;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  description: string;
  featuredImage: Image | null;
  images: {
    edges: { node: Image }[];
  };
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  variants: {
    edges: { node: ProductVariant }[];
  };
  collections: {
    edges: { node: Pick<Collection, "handle" | "title" | "image"> }[];
  };
};

export type ProductHeader = Pick<
  Product,
  "id" | "handle" | "title" | "vendor" | "description" | "collections"
>;

export type ProductCard = Pick<
  Product,
  "id" | "handle" | "title" | "productType" | "featuredImage" | "priceRange"
>;

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

export type ProductsPageResult = {
  products: ProductCard[];
  pageInfo: PageInfo;
};

export type CollectionPageResult = {
  collection: Collection;
  products: ProductCard[];
  pageInfo: PageInfo;
};

export type SearchPageResult = {
  products: ProductCard[];
  pageInfo: PageInfo;
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      handle: string;
      title: string;
      featuredImage: Image | null;
    };
    price: Money;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: {
    edges: { node: CartLine }[];
  };
};

export type Connection<T> = {
  edges: { node: T }[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
};
