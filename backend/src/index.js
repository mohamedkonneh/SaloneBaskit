require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors'); 
const db = require('./config/db'); // Import the database connection
const { initSocket } = require('./socket'); // Import the socket initializer

// --- Route Imports ---
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const contentRoutes = require('./routes/contentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const pushRoutes = require('./routes/pushRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Define allowed origins. Use an environment variable for the production frontend URL.
const allowedOrigins = [
  'http://localhost:5173', // Local development
  process.env.FRONTEND_URL, // Production frontend
];

// --- Middleware ---
app.use(cors({ origin: allowedOrigins })); // Configure CORS for specific origins
app.use(express.json()); // Allows the server to understand JSON data

// --- Serve Static Files (like uploaded images) ---
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Root Endpoint for Health Check ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
initSocket(server);
 
const startServer = async () => {
  try {
    // You can add a check here to ensure DB is connected if db.query is available
    await db.query('SELECT NOW()');
    console.log('Database connected successfully.');
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;