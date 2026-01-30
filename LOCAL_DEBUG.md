# 🔍 Local Debugging Guide - No Console Logs

## The Problem
You're not seeing any console logs when running the server locally.

## Quick Test

Run this test script first to see what's happening:

```bash
cd backend
node test-start.js
```

This will:
- ✅ Check if Node.js is working
- ✅ Check if .env file exists
- ✅ Check if app.js can load
- ✅ Try to start the server
- ✅ Show any errors

## How to Run the Server Correctly

### ❌ WRONG - Running from root directory
```bash
# DON'T DO THIS - This runs React dev server, not backend
npm start
```

### ✅ CORRECT - Running from backend directory

**Option 1: Using npm**
```bash
cd backend
npm start
```

**Option 2: Using node directly**
```bash
cd backend
node src/server.js
```

**Option 3: Using the test script**
```bash
cd backend
node test-start.js
```

## What You Should See

When the server starts correctly, you should IMMEDIATELY see:

```
============================================================
🚀 Starting Server
============================================================
Environment: development
Port: 5000
Current working directory: C:\Users\priya\Downloads\student-management\backend
__dirname: C:\Users\priya\Downloads\student-management\backend\src

Build Configuration:
  Build path: C:\Users\priya\Downloads\student-management\build
  Build folder exists: false (or true if you built React)

Database Configuration:
  DB_HOST: localhost
  DB_NAME: student_db
  DB_USER: root
  DB_PORT: 3306

Registering API routes...
✓ API routes registered

=== Static Files Configuration ===
Build path: C:\Users\priya\Downloads\student-management\build
Build folder exists: false

============================================================
✅ Server listening on port 5000
============================================================

📋 Registered Routes:
  GET  /api/health
  GET  /api/test
  GET  /api/v1/students
  ...

============================================================
Ready to accept requests!
============================================================
```

## Common Issues

### Issue 1: Running from Wrong Directory

**Symptom:** No logs, or error about missing modules

**Fix:**
```bash
# Make sure you're in the backend directory
cd backend
npm start
```

### Issue 2: Port Already in Use

**Symptom:** Error: `EADDRINUSE` or port already in use

**Fix:**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change PORT in .env file
```

### Issue 3: Missing Dependencies

**Symptom:** Error: `Cannot find module 'express'`

**Fix:**
```bash
cd backend
npm install
```

### Issue 4: Database Connection Error

**Symptom:** Server starts but crashes when accessing `/api/v1/students`

**Fix:**
- Make sure MySQL is running
- Check `.env` file has correct DB credentials
- Test connection: `mysql -u root -p`

### Issue 5: .env File Missing

**Symptom:** Database config shows "not set"

**Fix:**
```bash
cd backend
copy .env.example .env
# Then edit .env with your database credentials
```

## Step-by-Step Debugging

### Step 1: Verify You're in the Right Directory
```bash
# Should show: backend
pwd  # Linux/Mac
cd   # Windows PowerShell
```

### Step 2: Check .env File Exists
```bash
# Windows
dir .env

# Should show: .env file exists
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run Test Script
```bash
node test-start.js
```

**Expected output:**
- ✅ All tests pass
- ✅ Server starts
- ✅ Shows "ALL TESTS PASSED"

### Step 5: Start Server
```bash
npm start
# OR
node src/server.js
```

### Step 6: Test the Server

Open a new terminal and test:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Should return: {"status":"ok"}
```

Or open in browser:
- http://localhost:5000/api/health
- http://localhost:5000/api/test
- http://localhost:5000/api/v1/students?page=1&limit=5

## Still No Logs?

If you run `node test-start.js` and see NO output at all:

1. **Check Node.js is installed:**
   ```bash
   node --version
   ```
   Should show version number (e.g., v18.0.0)

2. **Check you're in the right directory:**
   ```bash
   cd backend
   ls  # Should show: src, package.json, .env, etc.
   ```

3. **Try running with explicit path:**
   ```bash
   node C:\Users\priya\Downloads\student-management\backend\src\server.js
   ```

4. **Check for syntax errors:**
   ```bash
   node -c src/server.js
   ```
   Should show no errors

5. **Check file permissions:**
   - Make sure you can read the files
   - Try running as administrator if needed

## Quick Checklist

- [ ] In `backend` directory (not root)
- [ ] `.env` file exists
- [ ] `npm install` completed successfully
- [ ] MySQL is running (if testing database)
- [ ] Port 5000 is not in use
- [ ] Running: `npm start` or `node src/server.js`
- [ ] See startup logs immediately

## Need More Help?

Run the test script and share the output:
```bash
cd backend
node test-start.js > test-output.txt 2>&1
```

Then share the contents of `test-output.txt`.
