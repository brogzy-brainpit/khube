// pages/api/account/logout.js
import { stringifySetCookie } from 'cookie';

export default function handler(req, res) {
  res.setHeader(
    'Set-Cookie',
    stringifySetCookie({
      name: 'customer_token',
      value: '',
      path: '/',
      maxAge: 0, // delete immediately
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
  );

  res.redirect('/');
}