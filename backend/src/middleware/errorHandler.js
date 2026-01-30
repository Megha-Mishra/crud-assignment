const errorHandler = (err, req, res, next) => {
  console.error(`\n✗ ERROR HANDLER:`);
  console.error(`  Path: ${req.path}`);
  console.error(`  Method: ${req.method}`);
  console.error(`  Status Code: ${err.statusCode || 500}`);
  console.error(`  Message: ${err.message || "Internal server error"}`);
  console.error(`  Stack:`, err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
