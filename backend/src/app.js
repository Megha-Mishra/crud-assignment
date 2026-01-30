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


app.use("/api", (req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});


const buildPath = path.join(__dirname, "..", "..", "build");
const hasBuild = fs.existsSync(buildPath);
if (hasBuild) {
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    express.static(buildPath)(req, res, next);
  });
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(buildPath, "index.html"), (err) => {
      if (err) {
        console.error("Error serving index.html:", err);
        next(err);
      }
    });
  });
}

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
