/**
 * Global Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Express error handler caught an error:', err);

  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const response = {
    success: false,
    message: isProduction && status === 500 ? 'An unexpected server error occurred.' : err.message,
    errorCode: err.code || err.errorCode || 'INTERNAL_SERVER_ERROR'
  };

  // If there are detailed validation error details
  if (err.errors) {
    response.errors = err.errors;
  }

  // Include stack trace in development mode only
  if (!isProduction) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}

module.exports = errorHandler;
