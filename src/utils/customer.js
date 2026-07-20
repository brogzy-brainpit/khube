export async function getCustomer(accessToken) {
  const res = await fetch(
    `https://shopify.com/${process.env.SHOPIFY_STORE_ID}/account/customer/api/2024-10/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify({
        query: `{
          customer {
            id
            firstName
            lastName
            emailAddress { emailAddress }
            orders(first: 5) {
              nodes {
                id
                name
                totalPrice { amount currencyCode }
              }
            }
          }
        }`,
      }),
    }
  );

  return res.json();
}
