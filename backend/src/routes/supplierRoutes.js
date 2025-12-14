const express = require('express');
const router = express.Router();
const { 
  getSuppliers, 
  getSupplierById, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier 
} = require('../controllers/supplierController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route to get all suppliers
router.route('/').get(getSuppliers).post(protect, admin, createSupplier);

// Route to get a single supplier by their ID
router.route('/:id').get(getSupplierById).put(protect, admin, updateSupplier).delete(protect, admin, deleteSupplier);

module.exports = router;