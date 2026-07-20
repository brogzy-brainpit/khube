export async function getCustomer(accessToken) {
  const response = await fetch(
    'https://shopify.com/account/customer/api/2025-01/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          query {
            customer {
              id
              firstName
              lastName
              emailAddress {
                emailAddress
              }
            }
          }
        `,
      }),
    }
  );

  return response.json();
}