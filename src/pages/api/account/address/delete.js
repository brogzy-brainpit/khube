import { parseCookie } from 'cookie';
import { deleteAddress } from '@/utils/customer';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = parseCookie(req.headers.cookie || '');
    const token = cookies.customer_token;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.body;

    const result = await deleteAddress(token, id);

    return res.status(200).json(result);
  } catch (err) {
    console.error('Delete address error:', err);
    return res.status(500).json({ error: 'Failed to delete address' });
  }
}