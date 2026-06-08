export const customerAccountProfileQuery = `
  query CustomerAccountProfile {
    customer {
      displayName
      emailAddress {
        emailAddress
      }
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 4) {
              edges {
                node {
                  title
                  quantity
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
