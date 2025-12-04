const { Pool } = require('pg');

// The 'pg' library automatically uses environment variables for connection
// if they are present (e.g., PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT).
// For production environments like Render, it's best to use a single connection string.

const isProduction = process.env.NODE_ENV === 'production';

// Render provides the DATABASE_URL environment variable.
// We must connect using SSL in production, but not in local development.
const connectionConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
};

const pool = new Pool(connectionConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
};