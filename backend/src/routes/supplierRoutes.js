const express = require('express');
const router = express.Router();
const { getSuppliers, getSupplierById } = require('../controllers/supplierController');

// Route to get all suppliers
router.route('/').get(getSuppliers);

// Route to get a single supplier by their ID
router.route('/:id').get(getSupplierById);

module.exports = router;