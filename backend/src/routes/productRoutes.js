const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getProductsBySupplier, createProduct, updateProduct, deleteProduct, getPromotionalProducts } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/promotions', getPromotionalProducts);
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/supplier/:id').get(getProductsBySupplier);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;