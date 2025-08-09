
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const { rows } = await db.query('SELECT municipio, paid, pending, total FROM municipalities_financials');
      return res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
