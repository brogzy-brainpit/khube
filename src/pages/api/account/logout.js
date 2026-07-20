// pages/api/account/logout.js
import { serialize, stringifySetCookie } from 'cookie';

export default function handler(req, res) {
  res.setHeader(
  'Set-Cookie',
  stringifySetCookie('customer_token', '', { maxAge: -1, path: '/' })
);
  res.redirect('/');
}
