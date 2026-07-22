import { parseCookie } from 'cookie';
import { setDefaultAddress } from '@/utils/customer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = parseCookie(req.headers.cookie || '');
    const token = cookies.customer_token;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { addressId } = req.body;

    const result = await setDefaultAddress(token, addressId);

    return res.status(200).json(result);
  } catch (err) {
    console.error('Set default address error:', err);
    return res.status(500).json({ error: 'Failed to set default address' });
  }
}