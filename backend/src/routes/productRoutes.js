const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getProductsBySupplier, createProduct, updateProduct, deleteProduct, getPromotionalProducts, createProductReview } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateProductCreation, validateProductUpdate, validateReviewCreation } = require('../middleware/validationMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// A wrapper middleware to handle multer errors gracefully for product images
const handleUpload = (req, res, next) => {
  // The field name 'images' should match the frontend. Accept up to 5 files.
  upload.array('images', 5)(req, res, function (err) {
    if (err) {
      // Pass multer-specific or file-type errors to the central error handler
      return next(err);
    }
    next();
  });
};

router.get('/promotions', getPromotionalProducts);
router.route('/').get(getProducts).post(protect, admin, validateProductCreation, createProduct);
router.route('/supplier/:id').get(getProductsBySupplier);
router.route('/:id/reviews').post(protect, validateReviewCreation, createProductReview);
router.route('/:id').get(getProductById).put(protect, admin, validateProductUpdate, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;