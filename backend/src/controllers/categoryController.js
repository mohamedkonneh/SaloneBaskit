const db = require('../config/db');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(categories.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, description, is_showcased } = req.body;
  try {
    const newCategory = await db.query(
      'INSERT INTO categories (name, description, is_showcased) VALUES ($1, $2, $3) RETURNING *',
      [name, description, is_showcased || false]
    );
    res.status(201).json(newCategory.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  const { name, description, is_showcased } = req.body;
  try {
    // Check if the name is being changed to one that already exists on another category
    const nameExists = await db.query(
      'SELECT id FROM categories WHERE name = $1 AND id != $2',
      [name, req.params.id]
    );

    if (nameExists.rows.length > 0) {
      return res.status(400).json({ message: 'A category with this name already exists.' });
    }

    const updatedCategory = await db.query(
      'UPDATE categories SET name = $1, description = $2, is_showcased = $3 WHERE id = $4 RETURNING *',
      [name, description, is_showcased || false, req.params.id]
    );
    res.json(updatedCategory.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.json({ message: 'Category removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get showcased categories
// @route   GET /api/categories/showcase
// @access  Public
const getShowcasedCategories = async (req, res) => {
  try {
    const categories = await db.query('SELECT * FROM categories WHERE is_showcased = true ORDER BY name ASC');
    res.json(categories.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


module.exports = { getCategories, createCategory, updateCategory, deleteCategory, getShowcasedCategories };