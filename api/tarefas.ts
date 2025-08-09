
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const query = `
        SELECT t.id, t.task, t.date, t.hours, t.status, t.employee_id as "employeeId", e.name as "employeeName"
        FROM tasks t
        JOIN employees e ON t.employee_id = e.id
        ORDER BY t.date DESC
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
      const { employeeId, task, date, hours, status } = req.body;
      if (!employeeId || !task || !date || hours === undefined || !status) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }
      const query = 'INSERT INTO tasks(employee_id, task, date, hours, status) VALUES($1, $2, $3, $4, $5) RETURNING *';
      const { rows } = await db.query(query, [employeeId, task, date, hours, status]);
      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      if (!id) return res.status(400).json({ message: 'ID da tarefa é obrigatório.' });
      const { employeeId, task, date, hours, status } = req.body;
      if (!employeeId || !task || !date || hours === undefined || !status) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }
      const query = 'UPDATE tasks SET employee_id = $1, task = $2, date = $3, hours = $4, status = $5 WHERE id = $6 RETURNING *';
      const { rows } = await db.query(query, [employeeId, task, date, hours, status, id]);
      if (rows.length === 0) return res.status(404).json({ message: 'Tarefa não encontrada.' });
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'DELETE') {
     try {
      if (!id) return res.status(400).json({ message: 'ID da tarefa é obrigatório.' });
      const query = 'DELETE FROM tasks WHERE id = $1';
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
