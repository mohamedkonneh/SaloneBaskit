const express = require('express');
const router = express.Router();
const { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSuppliers) // This route is now public, allowing anyone to see the list of suppliers.
  .post(protect, admin, createSupplier);

router.route('/:id')
  .get(getSupplierById) // This route should also be public so anyone can view a single supplier's page.
  .put(protect, admin, updateSupplier)
  .delete(protect, admin, deleteSupplier);

module.exports = router;