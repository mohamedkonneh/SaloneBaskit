const { Pool } = require('pg');
require('dotenv').config();

// The Pool will manage multiple client connections for you.
// It will use the environment variables for the connection details.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};