import { Pool } from 'pg';

// The pool is created once when the module is first imported.
// Node.js's module cache will ensure subsequent imports get the same instance.
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = pool;
