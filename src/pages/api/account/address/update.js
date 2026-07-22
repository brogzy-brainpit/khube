import { parseCookie } from 'cookie';
import { updateAddress } from '@/utils/customer';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = parseCookie(req.headers.cookie || '');
    const token = cookies.customer_token;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

   const { id, address } = req.body;

const result = await updateAddress(token, id, address);

    return res.status(200).json(result);
  } catch (err) {
    console.error('Update address error:', err);
    return res.status(500).json({ error: 'Failed to update address' });
  }
}