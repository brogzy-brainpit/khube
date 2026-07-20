export default function Callback({ error }) {
  return (
    <div style={{ padding: '2rem' }}>
      {error ? (
        <>
          <h1>Callback Error</h1>
          <p>{error}</p>
        </>
      ) : (
        <p>Processing login...</p>
      )}
    </div>
  );
}

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader.split('; ').map((c) => {
      const [key, ...v] = c.split('=');
      return [key, v.join('=')];
    })
  );
}

function createCookie(name, value, options = {}) {
  let cookie = `${name}=${value}`;

  if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
  if (options.path) cookie += `; Path=${options.path}`;
  if (options.httpOnly) cookie += '; HttpOnly';
  if (options.secure) cookie += '; Secure';
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;

  return cookie;
}

export async function getServerSideProps({ query, req, res }) {
  try {
    const { code } = query;

    // Read PKCE verifier from cookie
    const cookies = parseCookies(req.headers.cookie || '');
    const verifier = cookies.pkce_verifier;

    if (!code || !verifier) {
      throw new Error('Missing authorization code or PKCE verifier');
    }

    // Exchange code for access token
    const tokenRes = await fetch(
      process.env.SHOPIFY_CUSTOMER_TOKEN_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.SHOPIFY_CUSTOMER_CLIENT_ID,
          redirect_uri: `${process.env.APP_URL}/account/callback`,
          code,
          code_verifier: verifier,
        }),
      }
    );

    const tokenData = await tokenRes.json();

    console.log('Token response:', tokenData);

    if (!tokenData.access_token) {
      throw new Error(
        tokenData.error_description ||
          tokenData.error ||
          'Failed to get access token'
      );
    }

    // Store access token in secure cookie
    res.setHeader('Set-Cookie', [
  createCookie(
    'customer_access_token',
    tokenData.access_token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      path: '/',
      maxAge: tokenData.expires_in || 60 * 60 * 24 * 30,
    }
  ),
  createCookie(
    'customer_api_url',
    tokenData.api_url,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      path: '/',
      maxAge: tokenData.expires_in || 60 * 60 * 24 * 30,
    }
  ),
]);

    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
    };
  } catch (error) {
    console.error('Callback error:', error);

    return {
      props: {
        error: error.message,
      },
    };
  }
}