
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const query = `
        SELECT d.id, d.description, d.type, d.value, d.date, d.status, d.invoice_url as "invoiceUrl", e.name as "employeeName"
        FROM expenses d
        JOIN employees e ON d.employee_id = e.id
        ORDER BY d.date DESC
      `;
      const { rows } = await db.query(query);
      return res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  if (req.method === 'POST') {
    try {
      const { employeeId, description, type, value, date, status, invoiceUrl } = req.body;
      const query = 'INSERT INTO expenses(employee_id, description, type, value, date, status, invoice_url) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      const { rows } = await db.query(query, [employeeId, description, type, value, date, status, invoiceUrl]);
      return res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (!id) return res.status(400).json({ message: 'ID da despesa é obrigatório' });
      await db.query('DELETE FROM expenses WHERE id = $1', [id]);
      return res.status(204).send(null);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
