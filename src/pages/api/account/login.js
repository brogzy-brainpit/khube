import { stringifySetCookie } from 'cookie';
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

  // Store verifier + state in short-lived cookies
  res.setHeader('Set-Cookie', [
    stringifySetCookie({
      name: 'code_verifier',
      value: codeVerifier,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 5, // 5 minutes
    }),
    stringifySetCookie({
      name: 'oauth_state',
      value: state,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 5,
    }),
  ]);

  const params = new URLSearchParams({
    client_id: process.env.SHOPIFY_CUSTOMER_CLIENT_ID,
    response_type: 'code',
    redirect_uri: `${process.env.APP_URL}/api/account/callback`,
    scope: 'openid email customer-account-api:full',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  });

  res.redirect(`${process.env.SHOPIFY_CUSTOMER_AUTH_URL}?${params}`);
}