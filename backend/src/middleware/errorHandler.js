const errorHandler = (err, req, res, next) => {
  console.error(`\n✗ ERROR HANDLER:`);
  console.error(`  Path: ${req.path}`);
  console.error(`  Method: ${req.method}`);
  console.error(`  Status Code: ${err.statusCode || 500}`);
  console.error(`  Message: ${err.message || "Internal server error"}`);
  console.error(`  Code: ${err.code || "N/A"}`);
  console.error(`  Stack:`, err.stack);

  const statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Don't expose DB details in production, but log them
  if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
    console.error("  → Database connection failed. Check DB_HOST, DB_PORT, and that MySQL is reachable.");
    if (process.env.NODE_ENV === "production") {
      message = "Database connection failed. Check server configuration.";
    }
  }
  if (err.code === "ER_ACCESS_DENIED_ERROR") {
    console.error("  → Database auth failed. Check DB_USER and DB_PASSWORD.");
    if (process.env.NODE_ENV === "production") {
      message = "Database authentication failed.";
    }
  }
  if (err.code === "ER_BAD_DB_ERROR") {
    console.error("  → Database does not exist. Check DB_NAME.");
    if (process.env.NODE_ENV === "production") {
      message = "Database not found.";
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
