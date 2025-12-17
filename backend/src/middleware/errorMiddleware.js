const { MulterError } = require('multer');

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Check for Multer-specific errors
  if (err instanceof MulterError) {
    return res.status(400).json({ message: `File Upload Error: ${err.message}` });
  }

  // Handle the custom file filter error
  if (err.message === 'Error: Images Only!') {
    return res.status(400).json({ message: 'Invalid file type. Please upload an image (jpeg, png, gif).' });
  }

  // Default to 500 server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };