
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { rows } = await db.query('SELECT id, name, role, department, email FROM employees ORDER BY name');
      return res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, role, department, email } = req.body;
      if (!name || !role || !department || !email) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }
      const query = 'INSERT INTO employees(name, role, department, email) VALUES($1, $2, $3, $4) RETURNING *';
      const { rows } = await db.query(query, [name, role, department, email]);
      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'PUT') {
     try {
      if (!id) return res.status(400).json({ message: 'ID do funcionário é obrigatório.' });
      const { name, role, department, email } = req.body;
      if (!name || !role || !department || !email) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }
      const query = 'UPDATE employees SET name = $1, role = $2, department = $3, email = $4 WHERE id = $5 RETURNING *';
      const { rows } = await db.query(query, [name, role, department, email, id]);
      if (rows.length === 0) return res.status(404).json({ message: 'Funcionário não encontrado.' });
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (!id) return res.status(400).json({ message: 'ID do funcionário é obrigatório.' });
      const query = 'DELETE FROM employees WHERE id = $1';
      await db.query(query, [id]);
      return res.status(204).send(null);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
