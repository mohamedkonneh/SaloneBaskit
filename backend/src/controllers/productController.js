const db = require('../config/db');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (product.rows.length > 0) {
      res.json(product.rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Fetch products by supplier
// @route   GET /api/products/supplier/:id
// @access  Public
const getProductsBySupplier = async (req, res) => {
  try {
    const products = await db.query('SELECT * FROM products WHERE supplier_id = $1 ORDER BY created_at DESC', [req.params.id]);
    res.json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, description, brand, category, count_in_stock, supplier_id, is_deal_of_the_day, is_flash_sale, is_new_arrival, discounted_price, has_free_delivery, estimated_delivery, colors, sizes, is_highlighted, image_urls } = req.body;

    const newProductQuery = `
      INSERT INTO products (name, price, description, brand, category, count_in_stock, supplier_id, is_deal_of_the_day, is_flash_sale, is_new_arrival, discounted_price, has_free_delivery, estimated_delivery, colors, sizes, is_highlighted, image_urls)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;
    const newProduct = await db.query(newProductQuery, [name, price, description, brand, category, count_in_stock, supplier_id, is_deal_of_the_day, is_flash_sale, is_new_arrival, discounted_price, has_free_delivery, estimated_delivery, colors, sizes, is_highlighted, image_urls]);

    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, brand, category, count_in_stock, supplier_id, is_deal_of_the_day, is_flash_sale, is_new_arrival, discounted_price, has_free_delivery, estimated_delivery, colors, sizes, is_highlighted, image_urls } = req.body;

    const updatedProduct = await db.query(
      `UPDATE products SET 
        name = $1, price = $2, description = $3, brand = $4, category = $5, count_in_stock = $6, supplier_id = $7, is_deal_of_the_day = $8, is_flash_sale = $9, is_new_arrival = $10, discounted_price = $11, has_free_delivery = $12, estimated_delivery = $13, colors = $14, sizes = $15, is_highlighted = $16, image_urls = $17
       WHERE id = $18 RETURNING *`,
      [name, price, description, brand, category, count_in_stock, supplier_id, is_deal_of_the_day, is_flash_sale, is_new_arrival, discounted_price, has_free_delivery, estimated_delivery, colors, sizes, is_highlighted, image_urls, req.params.id]
    );

    res.json(updatedProduct.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get promotional products
// @route   GET /api/products/promotions
// @access  Public
const getPromotionalProducts = async (req, res) => {
  try {
    const query = `
      SELECT * FROM products 
      WHERE is_deal_of_the_day = true OR is_flash_sale = true OR is_new_arrival = true
      ORDER BY created_at DESC
    `;
    const products = await db.query(query);
    res.json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getProducts, getProductById, getProductsBySupplier, createProduct, updateProduct, deleteProduct, getPromotionalProducts };