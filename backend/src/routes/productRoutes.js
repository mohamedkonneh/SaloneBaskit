const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getProductsBySupplier, createProduct, updateProduct, deleteProduct, getPromotionalProducts, createProductReview } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateProductCreation, validateProductUpdate, validateReviewCreation } = require('../middleware/validationMiddleware');

router.get('/promotions', getPromotionalProducts);
router.route('/').get(getProducts).post(protect, admin, validateProductCreation, createProduct);
router.route('/supplier/:id').get(getProductsBySupplier);
router.route('/:id').get(getProductById).put(protect, admin, validateProductUpdate, updateProduct).delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, validateReviewCreation, createProductReview);

module.exports = router;