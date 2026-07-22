// utils/customer.js

const CUSTOMER_API_URL =
  `https://shopify.com/${process.env.SHOPIFY_STORE_ID}/account/customer/api/2024-10/graphql`;

async function customerFetch(accessToken, query, variables = {}) {
  const res = await fetch(CUSTOMER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  return res.json();
}

// Get customer + orders + addresses
export async function getCustomer(accessToken) {
  return customerFetch(
    accessToken,
    `
      query GetCustomer {
        customer {
          id
          firstName
          lastName
          emailAddress {
            emailAddress
          }

          orders(first: 5) {
            nodes {
              id
              name
              totalPrice {
                amount
                currencyCode
              }
            }
          }

          addresses(first: 10) {
            nodes {
              id
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              country
              phoneNumber
              formatted
            }
          }
        }
      }
    `
  );
}

// Add new address
export async function addAddress(accessToken, address) {
  return customerFetch(
    accessToken,
    `
      mutation AddAddress($address: MailingAddressInput!) {
        customerAddressCreate(address: $address) {
          customerAddress {
            id
            firstName
            lastName
            address1
            city
            country
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    { address }
  );
}

// Update existing address
export async function updateAddress(accessToken, id, address) {
  return customerFetch(
    accessToken,
    `
      mutation UpdateAddress($id: ID!, $address: MailingAddressInput!) {
        customerAddressUpdate(id: $id, address: $address) {
          customerAddress {
            id
            firstName
            lastName
            address1
            city
            country
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    { id, address }
  );
}

// Delete address
export async function deleteAddress(accessToken, id) {
  return customerFetch(
    accessToken,
    `
      mutation DeleteAddress($id: ID!) {
        customerAddressDelete(addressId: $id) {
          deletedAddressId
          userErrors {
            field
            message
          }
        }
      }
    `,
    { id }
  );
}