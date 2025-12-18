const express = require('express');
const router = express.Router();
const { uploadImages } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// A wrapper middleware to handle multer errors gracefully
const handleUpload = (req, res, next) => {
  // The field name 'images' should match the frontend. Accept up to 5 files.
  upload.array('images', 5)(req, res, function (err) {
    if (err) {
      return next(err); // Pass errors to the central error handler
    }
    next();
  });
};

router.post('/', protect, handleUpload, uploadImages);

module.exports = router;