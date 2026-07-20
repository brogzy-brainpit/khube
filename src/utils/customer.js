export async function getCustomer(accessToken) {
  const response = await fetch(
    'https://shopify.com/authentication/82887606529/account/customer/api/2025-01/graphql',
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

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}