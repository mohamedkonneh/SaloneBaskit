const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getProductsBySupplier, createProduct, updateProduct, deleteProduct, getPromotionalProducts, createProductReview } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateProductCreation, validateProductUpdate, validateReviewCreation } = require('../middleware/validationMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// A wrapper middleware to handle multer errors gracefully for product images
const handleUpload = (req, res, next) => {
  // The field name 'image' should match what the frontend is sending
  upload.single('image')(req, res, function (err) {
    if (err) {
      // Pass multer-specific or file-type errors to the central error handler
      return next(err);
    }
    next();
  });
};

router.get('/promotions', getPromotionalProducts);
router.route('/').get(getProducts).post(protect, admin, handleUpload, validateProductCreation, createProduct);
router.route('/supplier/:id').get(getProductsBySupplier);
router.route('/:id').get(getProductById).put(protect, admin, validateProductUpdate, updateProduct).delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, validateReviewCreation, createProductReview);

module.exports = router;