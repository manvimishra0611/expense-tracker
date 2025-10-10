// middleware/errorMiddleware.js

// 🔹 404 handler for unknown routes
function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
}

// 🔹 Global error handler
function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
  });
}

module.exports = { notFound, errorHandler };

