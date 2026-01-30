# Debug Logs Guide

## What to Look For in Render Logs

After deploying, check the **Logs** tab in Render to see what's happening.

### ✅ Server Started Successfully

You should see:
```
============================================================
🚀 Starting Server
============================================================
Environment: production
Port: 10000
Current working directory: /opt/render/project/src
__dirname: /opt/render/project/src/backend/src

Build Configuration:
  Build path: /opt/render/project/src/build
  Build folder exists: true
  Build files found: 15 items
  Sample files: index.html, static, asset-manifest.json, ...

Database Configuration:
  DB_HOST: your-db-host
  DB_NAME: student_db
  DB_USER: your-user
  DB_PORT: 3306

============================================================
✅ Server listening on port 10000
============================================================

📋 Registered Routes:
  GET  /api/health
  GET  /api/test
  GET  /api/v1/students
  GET  /api/v1/students/:id
  POST /api/v1/students
  PUT  /api/v1/students/:id
  DELETE /api/v1/students/:id

============================================================
Ready to accept requests!
============================================================
```

### ✅ API Request Working

When you visit `https://crud-assignment-1-a3d7.onrender.com/api/v1/students?page=1&limit=5`, you should see:

```
------------------------------------------------------------
[2026-01-30T12:00:00.000Z] GET /api/v1/students
  Original URL: /api/v1/students?page=1&limit=5
  Query: { page: '1', limit: '5' }
✓ /api/v1/students route matched - Method: GET, Path: /students
✓ GET /api/v1/students route handler called
  Query params: { page: '1', limit: '5' }

📥 listStudents controller called
  Page: 1, Limit: 5
  Executing COUNT query...
  Total students: 10, Total pages: 2
  Executing SELECT query (LIMIT 5, OFFSET 0)...
  ✓ Query successful, returning 5 students
  → Response: 200 (45ms)
------------------------------------------------------------
```

### ❌ 404 Error - Route Not Found

If you see this, the route didn't match:

```
------------------------------------------------------------
[2026-01-30T12:00:00.000Z] GET /api/v1/students
  Original URL: /api/v1/students?page=1&limit=5
  Query: { page: '1', limit: '5' }
  → Skipping static for API route: /api/v1/students
  → SPA fallback skipped for API route: /api/v1/students

✗ 404 - Route not found:
  Method: GET
  Path: /api/v1/students
  Original URL: /api/v1/students?page=1&limit=5
  Query: { page: '1', limit: '5' }
  → Response: 404 (2ms)
------------------------------------------------------------
```

**This means:** The route `/api/v1/students` was never registered or matched.

### ❌ Build Folder Not Found

If you see:
```
Build folder not found at: /opt/render/project/src/build
  Current working directory: /opt/render/project/src
  __dirname: /opt/render/project/src/backend/src
```

**This means:** The React build didn't run or the path is wrong. Check your Build Command includes `npm run build`.

### ❌ Database Connection Error

If you see:
```
✗ ERROR HANDLER:
  Path: /api/v1/students
  Method: GET
  Status Code: 500
  Message: connect ECONNREFUSED 127.0.0.1:3306
```

**This means:** Database connection failed. Check your `DB_HOST` environment variable (should NOT be localhost).

### ❌ No Logs at All

If you don't see ANY logs when making a request:

**This means:** The Node server is NOT running. Your service is likely a **Static Site**, not a **Web Service**.

**Fix:** Convert to Web Service with Start Command: `node backend/src/server.js`

## Quick Diagnostic Steps

1. **Check Service Type**
   - Render Dashboard → Your Service → Check if it says "Web Service" or "Static Site"
   - Must be "Web Service"!

2. **Check Logs on Startup**
   - Look for "🚀 Starting Server" message
   - If missing, server didn't start

3. **Test Health Endpoint**
   - Visit: `https://crud-assignment-1-a3d7.onrender.com/api/health`
   - Should see logs: `✓ Health check route hit`
   - Should return: `{"status":"ok"}`

4. **Test Students Endpoint**
   - Visit: `https://crud-assignment-1-a3d7.onrender.com/api/v1/students?page=1&limit=5`
   - Check logs for route matching and controller execution
   - If you see "404 - Route not found", routes aren't registered

5. **Check Build**
   - Look for "Build folder exists: true"
   - If false, build command didn't run correctly

## Common Issues & Solutions

| Issue | Log Evidence | Solution |
|-------|-------------|----------|
| Static Site | No server logs at all | Convert to Web Service |
| Routes not registered | 404 with no route match logs | Check Start Command |
| Build missing | "Build folder not found" | Fix Build Command |
| DB error | "connect ECONNREFUSED" | Set DB_HOST to production DB |
| Wrong path | 404 but route logs show match | Check route path in logs |
