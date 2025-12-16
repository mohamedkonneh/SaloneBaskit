const db = require('../config/db');

// @desc    Fetch all suppliers
// @route   GET /api/suppliers
// @access  Public
const getSuppliers = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM suppliers ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error.message);
    res.status(500).json({ message: 'Server error while fetching suppliers.' });
  }
};

// @desc    Fetch a single supplier by ID
// @route   GET /api/suppliers/:id
// @access  Public
const getSupplierById = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM suppliers WHERE id = $1', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    console.error('Error fetching supplier by ID:', error.message);
    res.status(500).json({ message: 'Server error while fetching supplier.' });
  }
};

// @desc    Create a new supplier
// @route   POST /api/suppliers
// @access  Private/Admin
const createSupplier = async (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Supplier name and email are required.' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, contact_person, email, phone, address]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating supplier:', error.message);
    res.status(500).json({ message: 'Server error while creating supplier.' });
  }
};

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
const updateSupplier = async (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE suppliers SET name = $1, contact_person = $2, email = $3, phone = $4, address = $5 WHERE id = $6 RETURNING *',
      [name, contact_person, email, phone, address, req.params.id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    console.error('Error updating supplier:', error.message);
    res.status(500).json({ message: 'Server error while updating supplier.' });
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
    console.error('Error deleting supplier:', error.message);
    res.status(500).json({ message: 'Server error while deleting supplier.' });
  }
};

module.exports = { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier };