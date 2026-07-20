import cookie from 'cookie';

export default function Callback() {
  return null;
}

export async function getServerSideProps({ query, req, res }) {
  const { code } = query;

  // Get PKCE verifier from cookie
  const cookies = cookie.parse(req.headers.cookie || '');
  const verifier = cookies.pkce_verifier;

  if (!code || !verifier) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false,
      },
    };
  }

  // Exchange authorization code for access token
  const tokenRes = await fetch(process.env.SHOPIFY_CUSTOMER_TOKEN_URL, {
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
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    console.error('Token exchange failed:', tokenData);

    return {
      redirect: {
        destination: '/account/login',
        permanent: false,
      },
    };
  }

  // Store access token in secure HTTP-only cookie
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(
      'customer_access_token',
      tokenData.access_token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: tokenData.expires_in || 60 * 60 * 24 * 30,
      }
    )
  );

  return {
    redirect: {
      destination: '/account',
      permanent: false,
    },
  };
}