const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsBySupplier,
  createProduct,
  updateProduct,
  deleteProduct,
  getPromotionalProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/promotions', getPromotionalProducts);
router.get('/supplier/:id', getProductsBySupplier);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;