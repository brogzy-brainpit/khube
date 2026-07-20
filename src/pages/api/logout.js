// pages/api/account/logout.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  res.setHeader(
    'Set-Cookie',
    serialize('customer_token', '', { maxAge: -1, path: '/' })
  );
  res.redirect('/');
}
