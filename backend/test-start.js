// Simple test to verify server can start
console.log("=".repeat(60));
console.log("TEST: Can we start the server?");
console.log("=".repeat(60));

// Test 1: Check Node version
console.log("\n1. Node.js version:", process.version);

// Test 2: Check current directory
console.log("2. Current directory:", process.cwd());

// Test 3: Check if .env exists
const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, ".env");
console.log("3. .env file exists:", fs.existsSync(envPath));

// Test 4: Try loading dotenv
try {
  require("dotenv").config();
  console.log("4. dotenv loaded successfully");
  console.log("   PORT:", process.env.PORT || "not set (will use 5000)");
  console.log("   DB_HOST:", process.env.DB_HOST || "not set");
} catch (error) {
  console.error("4. Error loading dotenv:", error.message);
}

// Test 5: Try loading app
console.log("\n5. Attempting to load app.js...");
try {
  const app = require("./src/app");
  console.log("   ✓ app.js loaded successfully");
  console.log("   ✓ App type:", typeof app);
} catch (error) {
  console.error("   ✗ Error loading app.js:", error.message);
  console.error("   Stack:", error.stack);
  process.exit(1);
}

// Test 6: Try starting server
console.log("\n6. Attempting to start server...");
try {
  const PORT = process.env.PORT || 5000;
  const http = require("http");
  const app = require("./src/app");
  
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`   ✓ Server started on port ${PORT}`);
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL TESTS PASSED - Server can start!");
    console.log("=".repeat(60));
    console.log("\nTo start the server, run:");
    console.log("  cd backend");
    console.log("  npm start");
    console.log("\nOr:");
    console.log("  node src/server.js");
    console.log("\nPress Ctrl+C to stop this test server.");
    
    // Keep server running for 5 seconds then exit
    setTimeout(() => {
      console.log("\nTest complete. Exiting...");
      process.exit(0);
    }, 5000);
  });
  
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`   ✗ Port ${PORT} is already in use!`);
      console.error(`   Try: netstat -ano | findstr :${PORT}`);
    } else {
      console.error(`   ✗ Server error:`, error.message);
    }
    process.exit(1);
  });
} catch (error) {
  console.error("   ✗ Error starting server:", error.message);
  console.error("   Stack:", error.stack);
  process.exit(1);
}
