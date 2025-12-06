const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '..', '.env') });

// In a production environment like Render, DATABASE_URL will be set.
// This is a more reliable check than NODE_ENV for determining if SSL is needed.
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL;

console.log(`Creating new connection pool. SSL: ${isProduction}`);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getPool: () => pool,
};