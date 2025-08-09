/// <reference types="node" />

import { db } from '../api/db';
import { employees, tasks, financialDetails, expenses } from '../lib/data';

function parseDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

async function seedEmployees() {
  console.log('Seeding employees...');
  const insertedEmployees = [];
  for (const employee of employees) {
    const { rows } = await db.query(
      'INSERT INTO employees (id, name, role, department, email) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING RETURNING id',
      [employee.id, employee.name, employee.role, employee.department, employee.email]
    );
    if (rows[0]) {
      insertedEmployees.push(rows[0]);
    }
  }
  console.log(`Seeded ${insertedEmployees.length} new employees.`);
  return insertedEmployees;
}

async function seedTasks() {
  console.log('Seeding tasks...');
  let count = 0;
  for (const task of tasks) {
    await db.query(
      `INSERT INTO tasks (employee_id, task, date, hours, status) VALUES ($1, $2, $3, $4, $5)`,
      [task.employeeId, task.task, parseDate(task.date), task.hours, task.status]
    );
    count++;
  }
  console.log(`Seeded ${count} tasks.`);
}

async function seedFinancials() {
  console.log('Seeding financial details...');
  let count = 0;
  for (const detail of financialDetails) {
     await db.query(
      `INSERT INTO municipalities_financials (municipio, paid, pending, total) VALUES ($1, $2, $3, $4)`,
      [detail.municipio, detail.paid, detail.pending, detail.total]
    );
    count++;
  }
  console.log(`Seeded ${count} financial records.`);
}

async function seedExpenses() {
  console.log('Seeding expenses...');
  let count = 0;
  // Precisamos mapear o nome do funcionário para o ID
  const employeeNameIdMap = new Map<string, number>();
  employees.forEach(e => employeeNameIdMap.set(e.name, e.id));

  for (const expense of expenses) {
    const employeeId = employeeNameIdMap.get(expense.employeeName);
    if (!employeeId) {
      console.warn(`Could not find employee ID for "${expense.employeeName}". Skipping expense.`);
      continue;
    }
    
    await db.query(
      `INSERT INTO expenses (employee_id, description, type, value, date, status, invoice_url) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [employeeId, expense.description, expense.type, expense.value, parseDate(expense.date), expense.status, expense.invoiceUrl]
    );
    count++;
  }
  console.log(`Seeded ${count} expenses.`);
}


async function main() {
  const client = await db.connect();

  try {
    await client.query('BEGIN');
    
    console.log('Cleaning database...');
    // A ordem importa por causa das foreign keys. Excluímos das tabelas que referenciam antes.
    await client.query('TRUNCATE TABLE expenses, tasks, municipalities_financials, employees RESTART IDENTITY CASCADE');
    
    await seedEmployees();
    await seedTasks();
    await seedFinancials();
    await seedExpenses();

    await client.query('COMMIT');
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    (process as any).exit(1);
  } finally {
    client.release();
    await db.end(); // Fecha a pool
  }
}

main();