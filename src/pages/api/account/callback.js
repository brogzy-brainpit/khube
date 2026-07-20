import { parseCookie, stringifySetCookie } from 'cookie';

export default async function handler(req, res) {
  try {
    const { code, state } = req.query;
    const cookies = parseCookie(req.headers.cookie || '');

    // Validate state to prevent CSRF
    if (state !== cookies.oauth_state) {
      return res.status(400).send('Invalid state');
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
        redirect_uri: `${process.env.APP_URL}/api/account/callback`,
        code,
        code_verifier: cookies.code_verifier,
      }),
    });

    const data = await tokenRes.json();

    if (!data.access_token) {
      console.error('Token exchange failed:', data);
      return res.redirect('/account?error=auth_failed');
    }

    // Save customer token and clear temporary cookies
    res.setHeader('Set-Cookie', [
      stringifySetCookie({
        name: 'customer_token',
        value: data.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      }),
      stringifySetCookie({
        name: 'code_verifier',
        value: '',
        path: '/',
        maxAge: 0,
      }),
      stringifySetCookie({
        name: 'oauth_state',
        value: '',
        path: '/',
        maxAge: 0,
      }),
    ]);

    res.redirect('/account');
  } catch (err) {
    console.error('Callback error:', err);
    res.status(500).send('Authentication failed');
  }
}