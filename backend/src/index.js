const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { initSocket } = require('./socket');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const db = require('./config/db');

// Load environment variables from .env file in the backend root
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') }); // Adjusted path for .env in backend root

// --- Route Imports ---
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const chatRoutes = require('./routes/chatRoutes');
const contentRoutes = require('./routes/contentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const pushRoutes = require('./routes/pushRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// --- Middleware Setup ---
const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json()); // Body parser for JSON
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'))); // Serve uploaded files

// --- API Routes ---
app.get('/api', (req, res) => res.send('API is running...')); // Health check
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/contact', contactRoutes);

// --- Serve Frontend in Production ---
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.resolve(__dirname, '..', '..', 'frontend', 'dist');
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
  });
}

// --- Error Handling Middleware (must be last) ---
app.use(notFound);
app.use(errorHandler);

// --- Server and Socket.IO Initialization ---
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Ping the database to ensure a connection before starting the server.
    await db.query('SELECT NOW()');
    console.log('Database connected successfully.');
    server.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;