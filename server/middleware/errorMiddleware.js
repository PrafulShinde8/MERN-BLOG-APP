// Unsupported (404) routes
const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  // Middleware to handle errors
  const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }
  
    const statusCode = error.statusCode || 500; // Default to 500 if no status code is set
    res.status(statusCode).json({
      message: error.message || 'An unknown error occurred',
    });
  };
  
  module.exports = { notFound, errorHandler };
  