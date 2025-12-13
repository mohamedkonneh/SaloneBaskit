module.exports = {
  migrationsTable: 'pgmigrations',
  dir: 'src/migrations',
  direction: 'up',
  checkOrder: false,
  databaseUrl: process.env.DATABASE_URL,
  // In production, Render requires SSL but may not provide a CA certificate
  // Setting rejectUnauthorized to false allows the connection.
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};