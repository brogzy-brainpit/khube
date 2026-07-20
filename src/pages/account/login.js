import crypto from 'crypto';
import cookie from 'cookie';

export default function Login() {
  return null;
}

export async function getServerSideProps({ res }) {
  // Generate PKCE code verifier
  const verifier = crypto.randomBytes(32).toString('base64url');

  // Generate PKCE code challenge
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');

  // Store verifier in secure HTTP-only cookie
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('pkce_verifier', verifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
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

  return {
    redirect: {
      destination: authUrl,
      permanent: false,
    },
  };
}