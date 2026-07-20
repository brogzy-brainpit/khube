export default function Account({ customer, debug }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Account</h1>

      {customer ? (
        <>
          <p>
            <strong>Name:</strong> {customer.firstName} {customer.lastName}
          </p>
          <p>
            <strong>Email:</strong> {customer.emailAddress.emailAddress}
          </p>
        </>
      ) : (
        <p>Could not load customer data.</p>
      )}

      <hr />
      <h3>Debug Response</h3>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{debug}</pre>
    </div>
  );
}

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split('; ')
      .filter(Boolean)
      .map((c) => {
        const [key, ...v] = c.split('=');
        return [key, v.join('=')];
      })
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req.headers.cookie || '');
  const token = cookies.customer_access_token;
  const apiUrl = cookies.customer_api_url;

  if (!token || !apiUrl) {
    return {
      props: {
        customer: null,
        debug: 'Missing token or apiUrl cookie',
      },
    };
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

    const result = await response.json();

    return {
      props: {
        customer: result.data?.customer || null,
        debug: JSON.stringify(result, null, 2),
      },
    };
  } catch (error) {
    return {
      props: {
        customer: null,
        debug: error.message,
      },
    };
  }
}