const express = require('express');
const userRoutes = require('./userRoutes');
const db = require('../config/db');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const categoryRoutes = require('./categoryRoutes');
const supplierRoutes = require('./supplierRoutes');
const uploadRoutes = require('./uploadRoutes');
const contentRoutes = require('./contentRoutes');
const contactRoutes = require('./contactRoutes');
const pushRoutes = require('./pushRoutes');
const chatRoutes = require('./chatRoutes');

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    await db.query('SELECT NOW()');
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (e) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/upload', uploadRoutes);
router.use('/content', contentRoutes);
router.use('/contact', contactRoutes);
router.use('/push', pushRoutes);
router.use('/chat', chatRoutes);

module.exports = router;