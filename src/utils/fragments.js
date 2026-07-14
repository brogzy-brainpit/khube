const gql = String.raw;

export const PRODUCT_CARD_FRAGMENT = gql`
  fragment ProductCard on Product {
    id
    handle
    title

    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }

    images(first: 2) {
      edges {
        node {
          url
          altText
        }
      }
    }
  }
`;

// utils/fragments.js
export const COLLECTION_CARD_FRAGMENT = gql`
fragment Collection on Collection {
  id
  title
  handle
  image {
    id
    url
    altText
    width
    height
  }
}
`;