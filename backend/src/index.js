// Explicitly load environment variables at the very top
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const http = require('http');
const cors = require('cors'); 
const db = require('./config/db'); // Import the database connection
const { initSocket } = require('./socket'); // Import the socket initializer

// --- Route Imports ---
const apiRoutes = require('./routes'); // Import the central API router
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// --- CORS Configuration ---
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL] // Your production frontend URL from .env
  : ['http://localhost:3000', 'http://localhost:3001']; // Common local frontend ports

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.error(msg);
      callback(new Error(msg));
    }
  },
  optionsSuccessStatus: 200,
};

// --- Middleware ---
app.use(cors(corsOptions)); // Use secure CORS options
app.use(express.json()); // Allows the server to understand JSON data

// --- Serve Static Files (like uploaded images) ---
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Root Endpoint for Health Check ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- API Routes ---
app.use('/api', apiRoutes);

// --- Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler); // Use the new, more robust error handler

const PORT = process.env.PORT || 5000;

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
initSocket(server);
 
const startServer = async () => {
  try {
    // You can add a check here to ensure DB is connected if db.query is available
    await db.query('SELECT NOW()'); // This pings the database to check the connection.
    console.log('Database connected successfully.');
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// --- Graceful Shutdown ---
const gracefulShutdown = () => {
  console.log('Received shutdown signal, closing server gracefully.');
  server.close(() => {
    console.log('HTTP server closed.');
    // Close all connections in the database pool
    db.end();
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;