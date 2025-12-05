const { Pool } = require('pg');

// Use a singleton pattern to ensure only one pool is created.
let pool;
 
const getPool = () => {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
 
    // Render's external database URLs contain '.render.com' and require SSL.
    // This check is more robust than relying on NODE_ENV for scripts run locally.
    const isRenderDb = connectionString && connectionString.includes('.render.com');
 
    const connectionConfig = {
      connectionString: connectionString,
      // Apply SSL settings if it's a Render database, regardless of NODE_ENV.
      ssl: isRenderDb ? { rejectUnauthorized: false } : false,
    };
 
    console.log(`Creating new connection pool. SSL: ${!!connectionConfig.ssl}`);
    pool = new Pool(connectionConfig);
  }
  return pool;
};
 
module.exports = {
  // Ensure the pool is initialized before querying.
  query: (text, params) => getPool().query(text, params),
  // Exposing the pool can be useful for transactions or direct client access
  getPool: getPool,
};