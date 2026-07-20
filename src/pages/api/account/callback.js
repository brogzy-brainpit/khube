import { serialize, parse, parseCookie, stringifySetCookie } from 'cookie';

export default async function handler(req, res) {
  const { code, state } = req.query;
  const cookies = parseCookie(req.headers.cookie || '');

  // Validate state to prevent CSRF
  if (state !== cookies.oauth_state) {
    return res.status(400).send('Invalid state');
  }

  const tokenRes = await fetch(process.env.SHOPIFY_CUSTOMER_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SHOPIFY_CUSTOMER_CLIENT_ID,
      redirect_uri: `${process.env.APP_URL}/api/account/callback`,
      code,
      code_verifier: cookies.code_verifier, // 👈 replaces client_secret
    }),
  });

  const data = await tokenRes.json();

  if (!data.access_token) {
    console.error('Token exchange failed:', data);
    return res.redirect('/account/login?error=auth_failed');
  }


res.setHeader('Set-Cookie', [
  stringifySetCookie('customer_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  }),
  stringifySetCookie('code_verifier', '', { maxAge: -1, path: '/' }),
  stringifySetCookie('oauth_state', '', { maxAge: -1, path: '/' }),
]);

  res.redirect('/account');
}
