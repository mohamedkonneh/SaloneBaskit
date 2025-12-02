const db = require('../config/db');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private/Admin
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await db.query('SELECT * FROM suppliers ORDER BY name ASC');
    res.json(suppliers.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get supplier by ID
// @route   GET /api/suppliers/:id
// @access  Private
const getSupplierById = async (req, res) => {
  try {
    const supplier = await db.query('SELECT * FROM suppliers WHERE id = $1', [req.params.id]);
    if (supplier.rows.length > 0) {
      res.json(supplier.rows[0]);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a supplier
// @route   POST /api/suppliers
// @access  Private/Admin
const createSupplier = async (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  try {
    const newSupplier = await db.query(
      'INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, contact_person, email, phone, address]
    );
    res.status(201).json(newSupplier.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
const updateSupplier = async (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  try {
    const updatedSupplier = await db.query(
      'UPDATE suppliers SET name = $1, contact_person = $2, email = $3, phone = $4, address = $5 WHERE id = $6 RETURNING *',
      [name, contact_person, email, phone, address, req.params.id]
    );
    res.json(updatedSupplier.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
const deleteSupplier = async (req, res) => {
  try {
    await db.query('DELETE FROM suppliers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Supplier removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier };