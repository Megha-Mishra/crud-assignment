# 🚨 Render Deployment Fix - 404 Issue

## The Problem
Render is running `react-scripts start` (React dev server) instead of `node backend/src/server.js` (Express backend).

**Evidence from logs:**
```
> react-scripts start
Starting the development server...
```

This means:
- ❌ React dev server is running (no API routes)
- ❌ Express backend is NOT running
- ❌ `/api/v1/students` returns 404

## ✅ Solution

### Step 1: Verify Render Service Settings

Go to Render Dashboard → Your Service → Settings

**Check these settings:**

| Setting | Must Be |
|---------|---------|
| **Service Type** | `Web Service` (NOT Static Site) |
| **Root Directory** | `.` (empty/root) |
| **Build Command** | `npm install && npm run build && cd backend && npm install` |
| **Start Command** | `node backend/src/server.js` |

### Step 2: Update Start Command in Render Dashboard

1. Go to **Settings** → **Build & Deploy**
2. Find **Start Command**
3. Set it to: `node backend/src/server.js`
4. **Save Changes**

### Step 3: Verify package.json

The root `package.json` now has:
```json
"scripts": {
  "start": "node backend/src/server.js",
  "start:react": "react-scripts start"
}
```

This ensures `npm start` runs the backend, not React dev server.

### Step 4: Redeploy

1. Go to **Manual Deploy** → **Deploy latest commit**
2. Wait for build to complete
3. Check **Logs** tab

### Step 5: Verify Correct Logs

**✅ CORRECT logs (backend running):**
```
🚀 Starting Server
✅ Server listening on port 10000
📋 Registered Routes:
  GET  /api/health
  GET  /api/v1/students
```

**❌ WRONG logs (React dev server):**
```
Starting the development server...
webpack compiled successfully
```

### Step 6: Test After Deploy

1. **Health Check:**
   ```
   https://crud-assignment-1-a3d7.onrender.com/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Students API:**
   ```
   https://crud-assignment-1-a3d7.onrender.com/api/v1/students?page=1&limit=5
   ```
   Should return JSON (not 404)

3. **Frontend:**
   ```
   https://crud-assignment-1-a3d7.onrender.com/
   ```
   Should show React app (served by Express backend)

## If Still Getting 404

### Check 1: Service Type
- Dashboard → Service Type
- Must say **"Web Service"**
- If it says "Static Site" → Delete and recreate as Web Service

### Check 2: Start Command
- Settings → Start Command
- Must be: `node backend/src/server.js`
- NOT: `npm start` (this might use wrong script)
- NOT: `react-scripts start`

### Check 3: Build Command
- Settings → Build Command
- Must be: `npm install && npm run build && cd backend && npm install`
- This builds React AND installs backend dependencies

### Check 4: Environment Variables
- Environment tab
- Must have: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
- `DB_HOST` should NOT be `localhost` (use production MySQL)

### Check 5: Logs
- Logs tab → Look for:
  - `🚀 Starting Server` ✅
  - `✅ Server listening on port...` ✅
  - NOT: `Starting the development server...` ❌

## Quick Fix Checklist

- [ ] Service Type = **Web Service**
- [ ] Start Command = `node backend/src/server.js`
- [ ] Build Command includes `npm run build` AND `cd backend && npm install`
- [ ] Root package.json has `"start": "node backend/src/server.js"`
- [ ] Logs show "🚀 Starting Server" (not "Starting the development server")
- [ ] `/api/health` returns `{"status":"ok"}`
- [ ] `/api/v1/students` returns JSON (not 404)

## Still Not Working?

1. **Delete the service** in Render
2. **Create new Web Service** from scratch
3. Use these exact settings:
   ```
   Root Directory: . (empty)
   Build Command: npm install && npm run build && cd backend && npm install
   Start Command: node backend/src/server.js
   ```
4. Set environment variables
5. Deploy

The code is correct - the issue is Render configuration!
