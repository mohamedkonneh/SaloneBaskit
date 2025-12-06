// Middleware for handling 404 Not Found errors.
// This should be placed after all your routes.
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// General error handling middleware.
// This should be the very last middleware in your app.
const errorHandler = (err, req, res, next) => {
  // If the status code is 200, it means an error occurred without a specific error code, so we default to 500.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Only show the stack trace in development for security reasons.
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = { notFound, errorHandler };