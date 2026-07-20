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

export default function Account({ token, apiUrl }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Account</h1>
      <p><strong>Token exists:</strong> {token ? 'Yes' : 'No'}</p>
      <p><strong>API URL exists:</strong> {apiUrl ? 'Yes' : 'No'}</p>
      <p>We are temporarily stopping redirects to debug the session.</p>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req.headers.cookie || '');

  return {
    props: {
      token: cookies.customer_access_token || null,
      apiUrl: cookies.customer_api_url || null,
    },
  };
}