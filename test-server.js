// Simple test script to verify Node server can run
// Run this locally: node test-server.js
// Or use as Start Command in Render to test

console.log("=".repeat(60));
console.log("TEST SERVER STARTING");
console.log("=".repeat(60));
console.log("If you see this, Node.js is working!");
console.log("Time:", new Date().toISOString());
console.log("Node version:", process.version);
console.log("Working directory:", process.cwd());
console.log("=".repeat(60));

// Try to require the app
try {
  console.log("Attempting to load app...");
  require("dotenv").config();
  const app = require("./backend/src/app");
  console.log("✅ App loaded successfully!");
  console.log("✅ Routes should be registered");
} catch (error) {
  console.error("❌ Error loading app:", error.message);
  console.error("Stack:", error.stack);
  process.exit(1);
}

// Start server
const PORT = process.env.PORT || 5000;
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Test server is running! Node.js is working.\n");
});

server.listen(PORT, () => {
  console.log(`\n✅ Test server listening on port ${PORT}`);
  console.log(`✅ If you see this in Render logs, your Start Command is correct!`);
  console.log("=".repeat(60));
});
