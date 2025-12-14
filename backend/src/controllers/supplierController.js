const db = require('../config/db');

// @desc    Fetch all suppliers
// @route   GET /api/suppliers
// @access  Public
const getSuppliers = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name FROM suppliers ORDER BY name ASC');
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

module.exports = { getSuppliers, getSupplierById };