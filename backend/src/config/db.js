const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  // In production, Heroku/Render require SSL but may not provide a CA certificate
  // Setting rejectUnauthorized to false allows the connection.
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

module.exports = pool;