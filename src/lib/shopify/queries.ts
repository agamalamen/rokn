export const productCardFragment = `
  fragment ProductCard on Product {
    id
    handle
    title
    productType
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

export const getProductsQuery = `
  ${productCardFragment}
  query getProducts($first: Int, $after: String, $last: Int, $before: String) {
    products(first: $first, after: $after, last: $last, before: $before, sortKey: BEST_SELLING) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ...ProductCard
        }
      }
    }
  }
`;

export const searchProductsQuery = `
  ${productCardFragment}
  query searchProducts(
    $query: String!
    $first: Int!
    $after: String
    $last: Int
    $before: String
  ) {
    search(
      query: $query
      first: $first
      after: $after
      last: $last
      before: $before
      types: [PRODUCT]
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ... on Product {
            ...ProductCard
          }
        }
      }
    }
  }
`;

export const getProductHeaderByHandleQuery = `
  query getProductHeaderByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      vendor
      description
      collections(first: 20) {
        edges {
          node {
            handle
            title
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const getProductByHandleQuery = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      vendor
      productType
      description
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 25) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
      collections(first: 20) {
        edges {
          node {
            handle
            title
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const getCollectionsQuery = `
  query getCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after, sortKey: TITLE) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const getCollectionMetaByHandleQuery = `
  query getCollectionMetaByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
        width
        height
      }
    }
  }
`;

export const getCollectionByHandleQuery = `
  ${productCardFragment}
  query getCollectionByHandle(
    $handle: String!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
        width
        height
      }
      products(
        first: $first
        after: $after
        last: $last
        before: $before
        sortKey: BEST_SELLING
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            ...ProductCard
          }
        }
      }
    }
  }
`;

export const cartFragment = `
  fragment Cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                handle
                title
                featuredImage {
                  url
                  altText
                  width
                  height
                }
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export const createCartMutation = `
  ${cartFragment}
  mutation createCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const addToCartMutation = `
  ${cartFragment}
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const updateCartLineMutation = `
  ${cartFragment}
  mutation updateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const removeFromCartMutation = `
  ${cartFragment}
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const getCartQuery = `
  ${cartFragment}
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...Cart
    }
  }
`;
