const ApiError = require('../utils/ApiError');
const multer = require('multer');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let error = err;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = ApiError.badRequest('Validation failed', messages);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error = ApiError.badRequest('Duplicate value violates a unique constraint', err.keyValue);
  }

  // Mongoose invalid ObjectId / CastError
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid value for field "${err.path}"`);
  }

  // Multer file upload errors
  if (err instanceof multer.MulterError) {
    error = ApiError.badRequest(`File upload error: ${err.message}`);
  }

  if (!(error instanceof ApiError)) {
    error = new ApiError(500, error.message || 'Internal server error');
  }

  if (process.env.NODE_ENV !== 'production' && !error.isOperational) {
    console.error(err.stack);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
  });
}

function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = { errorHandler, notFoundHandler };
