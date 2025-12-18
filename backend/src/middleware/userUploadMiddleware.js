const { upload } = require('./uploadMiddleware');

// A wrapper middleware to handle multer errors gracefully for user photos
const handleUserPhotoUpload = (req, res, next) => {
  // The field name 'photo' must match what the frontend is sending
  upload.single('photo')(req, res, function (err) {
    if (err) {
      // Pass multer-specific or file-type errors to the central error handler
      return next(err);
    }
    next();
  });
};

module.exports = { handleUserPhotoUpload };