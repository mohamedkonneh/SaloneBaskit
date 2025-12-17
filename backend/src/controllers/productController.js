const db = require('../config/db');
const cloudinary = require('../config/cloudinary');

// Helper function to upload a file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        folder: 'products', // Organize product images
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

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
 
    // When using multipart/form-data, all body values are strings. We must parse them.
    const { name, description, brand, category, estimated_delivery, colors, sizes } = req.body;
    const price = parseFloat(req.body.price);
    const count_in_stock = parseInt(req.body.count_in_stock, 10);
    const supplier_id = parseInt(req.body.supplier_id, 10);
    const discounted_price = req.body.discounted_price ? parseFloat(req.body.discounted_price) : null;

    // Convert string 'true'/'false' to boolean
    const is_deal_of_the_day = req.body.is_deal_of_the_day === 'true';
    const is_flash_sale = req.body.is_flash_sale === 'true';
    const is_new_arrival = req.body.is_new_arrival === 'true';
    const has_free_delivery = req.body.has_free_delivery === 'true';
    const is_highlighted = req.body.is_highlighted === 'true';

    // Basic validation for required fields.
    const errors = [];
    if (!name) errors.push('Product name is required.');
    if (!description) errors.push('Description is required.');
    if (!brand) errors.push('Brand is required.');
    if (!category) errors.push('Category is required.');
    if (isNaN(price)) errors.push('A valid price is required.');
    if (isNaN(count_in_stock)) errors.push('Stock quantity is required.');
    if (isNaN(supplier_id)) errors.push('Supplier ID is required.');

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(' ') });
    }
 
    let imageUrls = ['https://via.placeholder.com/500x500.png?text=No+Image']; // A default placeholder

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrls = [result.secure_url];
    }

    const newProductQuery = `
      INSERT INTO products (name, price, description, brand, category, count_in_stock, supplier_id, is_deal_of_the_day, is_flash_sale, is_new_arrival, discounted_price, has_free_delivery, estimated_delivery, colors, sizes, is_highlighted, image_urls)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;
    const newProduct = await db.query(newProductQuery, [name, price, description, brand, category, count_in_stock, supplier_id, is_deal_of_the_day, is_flash_sale, is_new_arrival, discounted_price, has_free_delivery, estimated_delivery, colors, sizes, is_highlighted, imageUrls]);
 
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
    const productId = req.params.id;

    // 1. Fetch the existing product
    const productResult = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = productResult.rows[0];

    // 2. Prepare the updated data, parsing types and using existing values as fallbacks
    const data = {
      name: req.body.name || product.name,
      price: req.body.price ? parseFloat(req.body.price) : product.price,
      description: req.body.description || product.description,
      brand: req.body.brand || product.brand,
      category: req.body.category || product.category,
      count_in_stock: req.body.count_in_stock ? parseInt(req.body.count_in_stock, 10) : product.count_in_stock,
      supplier_id: req.body.supplier_id ? parseInt(req.body.supplier_id, 10) : product.supplier_id,
      is_deal_of_the_day: req.body.is_deal_of_the_day !== undefined ? req.body.is_deal_of_the_day === 'true' : product.is_deal_of_the_day,
      is_flash_sale: req.body.is_flash_sale !== undefined ? req.body.is_flash_sale === 'true' : product.is_flash_sale,
      is_new_arrival: req.body.is_new_arrival !== undefined ? req.body.is_new_arrival === 'true' : product.is_new_arrival,
      discounted_price: req.body.discounted_price ? parseFloat(req.body.discounted_price) : product.discounted_price,
      has_free_delivery: req.body.has_free_delivery !== undefined ? req.body.has_free_delivery === 'true' : product.has_free_delivery,
      estimated_delivery: req.body.estimated_delivery || product.estimated_delivery,
      colors: req.body.colors || product.colors,
      sizes: req.body.sizes || product.sizes,
      is_highlighted: req.body.is_highlighted !== undefined ? req.body.is_highlighted === 'true' : product.is_highlighted,
      // If a new file is uploaded, convert it to Base64. Otherwise, keep the existing image URLs.
      image_urls: product.image_urls, // Start with existing URLs
    };

    // If a new file is uploaded, upload it and replace the image_urls
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      data.image_urls = [result.secure_url];
    }

    // 2.5 Validate the parsed data
    const errors = [];
    if (!data.name) errors.push('Product name cannot be empty.');
    if (isNaN(data.price)) errors.push('Price must be a valid number.');
    if (isNaN(data.count_in_stock)) errors.push('Stock quantity must be a valid number.');
    if (isNaN(data.supplier_id)) errors.push('Supplier ID must be a valid number.');
    if (data.discounted_price !== null && isNaN(data.discounted_price)) {
      errors.push('Discounted price must be a valid number.');
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(' ') });
    }

    // 3. Dynamically build the UPDATE query to only change the fields that were actually sent
    const fields = Object.keys(data);
    const setClauses = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const values = Object.values(data);

    const updateQuery = `
      UPDATE products 
      SET ${setClauses} 
      WHERE id = $${fields.length + 1} 
      RETURNING *
    `;

    // 4. Execute the query
    const updatedProduct = await db.query(updateQuery, [...values, productId]);

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