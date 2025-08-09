import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { filename } = req.query;

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ message: 'Missing "filename" query parameter.' });
  }

  // A Vercel exige que o corpo da solicitação seja incluído no `put` call.
  const blob = await put(filename, req, {
    access: 'public',
  });

  return res.status(200).json(blob);
}
