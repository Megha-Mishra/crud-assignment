const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ===== REQUEST LOGGING MIDDLEWARE =====
app.use((req, res, next) => {
  const startTime = Date.now();
  console.log(`\n${"-".repeat(60)}`);
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log(`  Original URL: ${req.originalUrl}`);
  console.log(`  Query:`, req.query);
  if (Object.keys(req.body || {}).length > 0) {
    console.log(`  Body:`, req.body);
  }
  
  // Log response when it finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`  → Response: ${res.statusCode} (${duration}ms)`);
    console.log(`${"-".repeat(60)}`);
  });
  
  next();
});

app.use(cors());
app.use(express.json());

// ===== API ROUTES (registered first, before static files) =====
console.log("Registering API routes...");

app.get("/api/health", (req, res) => {
  console.log("✓ Health check route hit");
  res.json({ status: "ok" });
});

// Test route to verify server is running
app.get("/api/test", (req, res) => {
  console.log("✓ Test route hit");
  res.json({ 
    success: true, 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v1/students", (req, res, next) => {
  console.log(`✓ /api/v1/students route matched - Method: ${req.method}, Path: ${req.path}`);
  next();
}, studentRoutes);

console.log("✓ API routes registered");

// ===== STATIC FILES + SPA (only for non-API routes) =====
const buildPath = path.join(__dirname, "..", "..", "build");
const hasBuild = fs.existsSync(buildPath);

console.log(`\n=== Static Files Configuration ===`);
console.log(`Build path: ${buildPath}`);
console.log(`Build folder exists: ${hasBuild}`);

if (hasBuild) {
  console.log(`✓ Serving static files from: ${buildPath}`);
  
  // Serve static files - Express will only serve if no route matched above
  // API routes are already registered, so they take precedence
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      console.log(`  → Skipping static for API route: ${req.path}`);
      return next();
    }
    console.log(`  → Checking static files for: ${req.path}`);
    express.static(buildPath)(req, res, (err) => {
      if (err) {
        console.log(`  → Static file not found: ${req.path}`);
      } else {
        console.log(`  → Static file served: ${req.path}`);
      }
      next(err);
    });
  });
  
  // SPA fallback: serve index.html for non-API routes
  app.get("*", (req, res, next) => {
    // Skip API routes - they should have been handled above
    if (req.path.startsWith("/api")) {
      console.log(`  → SPA fallback skipped for API route: ${req.path}`);
      return next(); // Continue to 404 handler
    }
    console.log(`  → SPA fallback: serving index.html for ${req.path}`);
    // Serve React app for all other routes
    res.sendFile(path.join(buildPath, "index.html"), (err) => {
      if (err) {
        console.error(`  ✗ Error serving index.html:`, err.message);
        next(err);
      } else {
        console.log(`  ✓ Served index.html for ${req.path}`);
      }
    });
  });
} else {
  console.log(`✗ Build folder not found at: ${buildPath}`);
  console.log(`  Current working directory: ${process.cwd()}`);
  console.log(`  __dirname: ${__dirname}`);
}

// ===== 404 HANDLER =====
app.use((req, res) => {
  console.log(`\n✗ 404 - Route not found:`);
  console.log(`  Method: ${req.method}`);
  console.log(`  Path: ${req.path}`);
  console.log(`  Original URL: ${req.originalUrl}`);
  console.log(`  Query:`, req.query);
  res.status(404).json({ 
    success: false, 
    message: "Route not found",
    path: req.path,
    method: req.method
  });
});

app.use(errorHandler);

module.exports = app;
