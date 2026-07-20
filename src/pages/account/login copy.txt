import crypto from 'crypto';

export default function Login() {
  return null;
}

function base64URLEncode(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function createCookie(name, value, options = {}) {
  let cookie = `${name}=${encodeURIComponent(value)}`;

  if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
  if (options.path) cookie += `; Path=${options.path}`;
  if (options.httpOnly) cookie += '; HttpOnly';
  if (options.secure) cookie += '; Secure';
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;

  return cookie;
}

export async function getServerSideProps({ res }) {
  try {
    // Generate PKCE verifier
    const verifier = base64URLEncode(crypto.randomBytes(32));

    // Generate PKCE challenge
    const challenge = base64URLEncode(
      crypto.createHash('sha256').update(verifier).digest()
    );

    // Store PKCE verifier in a secure cookie
    res.setHeader(
      'Set-Cookie',
      createCookie('pkce_verifier', verifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        path: '/',
        maxAge: 60 * 10, // 10 minutes
      })
    );

    // Build Shopify authorization URL
    const authUrl =
      process.env.SHOPIFY_CUSTOMER_AUTH_URL +
      '?' +
      new URLSearchParams({
        client_id: process.env.SHOPIFY_CUSTOMER_CLIENT_ID,
        response_type: 'code',
        redirect_uri: `${process.env.APP_URL}/account/callback`,
        scope: 'openid email customer-account-api:full',
        code_challenge: challenge,
        code_challenge_method: 'S256',
      }).toString();
console.log('AUTH URL:', authUrl);
    return {
      redirect: {
        destination: authUrl,
        permanent: false,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
}