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

    defaultAddress {
      id
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
export async function addAddress(accessToken, address, defaultAddress = false) {
  return customerFetch(
    accessToken,
    `
      mutation customerAddressCreate(
        $address: CustomerAddressInput!
        $defaultAddress: Boolean
      ) {
        customerAddressCreate(
          address: $address
          defaultAddress: $defaultAddress
        ) {
          customerAddress {
            id
          }
          userErrors {
            code
            field
            message
          }
        }
      }
    `,
    { address, defaultAddress }
  );
}

// Update existing address
export async function updateAddress(
  accessToken,
  addressId,
  address,
  defaultAddress = false
) {
  return customerFetch(
    accessToken,
    `
      mutation customerAddressUpdate(
        $address: CustomerAddressInput!
        $addressId: ID!
        $defaultAddress: Boolean
      ) {
        customerAddressUpdate(
          address: $address
          addressId: $addressId
          defaultAddress: $defaultAddress
        ) {
          customerAddress {
            id
          }
          userErrors {
            code
            field
            message
          }
        }
      }
    `,
    { address, addressId, defaultAddress }
  );
}


// Delete address
// Delete address
export async function deleteAddress(accessToken, addressId) {
  return customerFetch(
    accessToken,
    `
      mutation customerAddressDelete($addressId: ID!) {
        customerAddressDelete(addressId: $addressId) {
          deletedAddressId
          userErrors {
            code
            field
            message
          }
        }
      }
    `,
    { addressId }
  );
}

// Set default address
export async function setDefaultAddress(accessToken, addressId) {
  return customerFetch(
    accessToken,
    `
      mutation customerAddressUpdate(
        $address: CustomerAddressInput!
        $addressId: ID!
        $defaultAddress: Boolean
      ) {
        customerAddressUpdate(
          address: $address
          addressId: $addressId
          defaultAddress: $defaultAddress
        ) {
          customerAddress {
            id
          }
          userErrors {
            code
            field
            message
          }
        }
      }
    `,
    {
      address: {}, // no fields need to change
      addressId,
      defaultAddress: true,
    }
  );
}