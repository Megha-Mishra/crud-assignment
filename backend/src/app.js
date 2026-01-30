const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/students", studentRoutes);

// Serve React build in production to avoid 404 on refresh / direct URLs
const buildPath = path.join(__dirname, "..", "..", "build");
const hasBuild = fs.existsSync(buildPath);
if (hasBuild) {
  app.use(express.static(buildPath));
  // SPA fallback: serve index.html for non-API routes (handles React Router)
  app.get("*", (req, res, next) => {
    // Skip API routes - let them fall through to 404 handler if not matched
    if (req.path.startsWith("/api/")) {
      return next();
    }
    // Serve React app for all other routes
    res.sendFile(path.join(buildPath, "index.html"), (err) => {
      if (err) {
        console.error("Error serving index.html:", err);
        next(err);
      }
    });
  });
}

// 404 handler for unmatched API routes and other requests
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
