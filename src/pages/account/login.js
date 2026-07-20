import crypto from 'crypto';
import cookie from 'cookie';

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

export async function getServerSideProps({ res }) {
  try {
    // Generate PKCE verifier
    const verifier = base64URLEncode(crypto.randomBytes(32));

    // Generate PKCE challenge
    const challenge = base64URLEncode(
      crypto.createHash('sha256').update(verifier).digest()
    );

    // Store verifier in secure HTTP-only cookie
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('pkce_verifier', verifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 10,
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

    return {
      redirect: {
        destination: authUrl,
        permanent: false,
      },
    };
  } catch (error) {
    console.error('Login route error:', error);

    return {
      props: {
        error: error.message,
      },
    };
  }
}