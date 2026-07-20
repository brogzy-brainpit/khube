export async function getCustomer(accessToken, apiUrl) {
  const response = await fetch(apiUrl, {
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
  });

  return response.json();
}