const db = require('../config/db');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    const keyword = req.query.keyword || '';

    // Base query and parameters
    let countQuery = 'SELECT COUNT(*) FROM products';
    let productsQuery = 'SELECT * FROM products';
    const params = [];

    // Add search keyword condition if it exists
    if (keyword) {
      const searchQuery = ' WHERE name ILIKE $1 OR description ILIKE $1';
      countQuery += searchQuery;
      productsQuery += searchQuery;
      params.push(`%${keyword}%`);
    }

    // If pagination parameters are provided, return the paginated object
    if (page && limit) {
      const offset = (page - 1) * limit;

      const totalProductsQuery = await db.query(countQuery, params);
      const totalProducts = parseInt(totalProductsQuery.rows[0].count, 10);

      productsQuery += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      const products = await db.query(productsQuery, [...params, limit, offset]);

      return res.json({
        products: products.rows,
        page,
        pages: Math.ceil(totalProducts / limit),
        total: totalProducts,
        keyword,
      });
    } else {
      // Otherwise, return all products in a simple array for backward compatibility
      productsQuery += ' ORDER BY created_at DESC';
      const products = await db.query(productsQuery, params);
      res.json(products.rows);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Failed to fetch products.' });
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
    res.status(500).json({ message: 'Failed to fetch product.' });
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
    res.status(500).json({ message: 'Failed to fetch products for supplier.' });
  }
};


// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    // The frontend sends JSON, so we can destructure directly.
    const { name, price, description, brand, category, count_in_stock, supplier_id, is_deal_of_the_day, is_flash_sale, is_new_arrival, discounted_price, has_free_delivery, estimated_delivery, colors, sizes, is_highlighted, image_urls } = req.body;

    // Basic validation for required fields.
    if (!name || !description || !brand || !category || price === undefined || count_in_stock === undefined || supplier_id === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields: name, description, brand, category, price, stock, and supplier.' });
    }
 
    const newProductQuery = `
      INSERT INTO products (name, price, description, brand, category, count_in_stock, supplier_id, is_deal_of_the_day, is_flash_sale, is_new_arrival, discounted_price, has_free_delivery, estimated_delivery, colors, sizes, is_highlighted, image_urls)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;
    const values = [
      name, price, description, brand, category, count_in_stock, supplier_id, is_deal_of_the_day, is_flash_sale, is_new_arrival, discounted_price, has_free_delivery, estimated_delivery, colors, sizes, is_highlighted, image_urls
    ];
    const newProduct = await db.query(newProductQuery, values);
 
    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    console.error(error.message);
    // Use the centralized error handler for a consistent JSON response
    res.status(500).json({ message: 'Failed to save product.' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, brand, category, count_in_stock, supplier_id, is_deal_of_the_day, is_flash_sale, is_new_arrival, discounted_price, has_free_delivery, estimated_delivery, colors, sizes, is_highlighted, image_urls } = req.body;

    const updatedProduct = await db.query('UPDATE products SET name = $1, price = $2, description = $3, brand = $4, category = $5, count_in_stock = $6, image_urls = $7 WHERE id = $8 RETURNING *', [name, price, description, brand, category, count_in_stock, image_urls, id]);

    if (updatedProduct.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(updatedProduct.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Failed to update product.' });
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
    res.status(500).json({ message: 'Failed to delete product.' });
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
    res.status(500).json({ message: 'Failed to fetch promotional products.' });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;
  const userId = req.user.id;

  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Check if the product exists
    const productResult = await client.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (productResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user has already reviewed this product
    const alreadyReviewed = await client.query('SELECT * FROM reviews WHERE product_id = $1 AND user_id = $2', [productId, userId]);
    if (alreadyReviewed.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // Insert the new review
    await client.query('INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4)', [productId, userId, rating, comment]);

    // Update the product's rating and number of reviews
    const updateProductQuery = `
      UPDATE products SET
        num_reviews = (SELECT COUNT(*) FROM reviews WHERE product_id = $1),
        rating = (SELECT AVG(rating) FROM reviews WHERE product_id = $1)
      WHERE id = $1
    `;
    await client.query(updateProductQuery, [productId]);

    await client.query('COMMIT');
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error.message);
    res.status(500).json({ message: 'Failed to add review.' });
  } finally {
    client.release();
  }
};

module.exports = { getProducts, getProductById, getProductsBySupplier, createProduct, updateProduct, deleteProduct, getPromotionalProducts, createProductReview };