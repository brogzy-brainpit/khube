import { serialize } from 'cookie';
import crypto from 'crypto';

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

export default function handler(req, res) {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString('hex');

  // Store verifier + state in a short-lived cookie
  res.setHeader('Set-Cookie', [
    serialize('code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 5, // 5 minutes
    }),
    serialize('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 5,
    }),
  ]);

  const params = new URLSearchParams({
    client_id: process.env.SHOPIFY_CUSTOMER_CLIENT_ID,
    response_type: 'code',
    redirect_uri: `${process.env.APP_URL}/api/account/callback`,
    scope: 'openid email https://api.customers.com/auth/customer.graphql',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  });

  res.redirect(`${process.env.SHOPIFY_CUSTOMER_AUTH_URL}?${params}`);
}
