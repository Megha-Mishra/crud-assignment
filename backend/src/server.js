// Add error handling at the very top
process.on('uncaughtException', (error) => {
  console.error('\n❌ UNCAUGHT EXCEPTION:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ UNHANDLED REJECTION:', reason);
  console.error('Promise:', promise);
});

console.log('Step 1: Loading dotenv...');
try {
  require("dotenv").config();
  console.log('✓ dotenv loaded');
} catch (error) {
  console.error('✗ Error loading dotenv:', error.message);
}

console.log('Step 2: Loading app...');
let app;
try {
  app = require("./app");
  console.log('✓ App loaded successfully');
} catch (error) {
  console.error('✗ Error loading app:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 5000;

console.log(`\n${"=".repeat(60)}`);
console.log(`🚀 Starting Server`);
console.log(`${"=".repeat(60)}`);
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`Port: ${PORT}`);
console.log(`Current working directory: ${process.cwd()}`);
console.log(`__dirname: ${__dirname}`);

// Debug: Check if build folder exists
const buildPath = path.join(__dirname, "..", "..", "build");
const hasBuild = fs.existsSync(buildPath);
console.log(`\nBuild Configuration:`);
console.log(`  Build path: ${buildPath}`);
console.log(`  Build folder exists: ${hasBuild}`);

if (hasBuild) {
  const buildFiles = fs.readdirSync(buildPath);
  console.log(`  Build files found: ${buildFiles.length} items`);
  console.log(`  Sample files:`, buildFiles.slice(0, 5).join(", "));
}

console.log(`\nDatabase Configuration:`);
console.log(`  DB_HOST: ${process.env.DB_HOST || "not set"}`);
console.log(`  DB_NAME: ${process.env.DB_NAME || "not set"}`);
console.log(`  DB_USER: ${process.env.DB_USER || "not set"}`);
console.log(`  DB_PORT: ${process.env.DB_PORT || "not set"}`);

app.listen(PORT, () => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`\n📋 Registered Routes:`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/test`);
  console.log(`  GET  /api/v1/students`);
  console.log(`  GET  /api/v1/students/:id`);
  console.log(`  POST /api/v1/students`);
  console.log(`  PUT  /api/v1/students/:id`);
  console.log(`  DELETE /api/v1/students/:id`);
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Ready to accept requests!`);
  console.log(`${"=".repeat(60)}\n`);
});
