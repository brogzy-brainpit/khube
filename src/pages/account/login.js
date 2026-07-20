import crypto from 'crypto';
import { serialize } from 'cookie';

export default function Login({ error }) {
  return (
    <div style={{ padding: '2rem' }}>
      {error ? (
        <>
          <h1>Login Error</h1>
          <p>{error}</p>
        </>
      ) : (
        <p>Redirecting to Shopify login...</p>
      )}
    </div>
  );
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
    const verifier = base64URLEncode(crypto.randomBytes(32));

    const challenge = base64URLEncode(
      crypto.createHash('sha256').update(verifier).digest()
    );

    res.setHeader(
      'Set-Cookie',
      serialize('pkce_verifier', verifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 10,
      })
    );

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
    return {
      props: {
        error: error.message,
      },
    };
  }
}