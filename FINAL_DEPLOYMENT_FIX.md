# 🚨 FINAL FIX: Render Still Running React Dev Server

## The Problem
Render is running `react-scripts start` instead of `node backend/src/server.js`, and backend dependencies aren't being installed.

## ✅ CRITICAL: Check Render Dashboard Settings

**Go to Render Dashboard → Your Service → Settings → Build & Deploy**

### Must Have These Exact Settings:

| Setting | Value |
|---------|-------|
| **Service Type** | `Web Service` (NOT Static Site) |
| **Root Directory** | `.` (empty/root) |
| **Build Command** | `npm install && npm run build && cd backend && npm install && cd ..` |
| **Start Command** | `node backend/src/server.js` |

**⚠️ IMPORTANT:** Even if you have `render.yaml`, Render Dashboard settings override it! You MUST set these manually in the dashboard.

## Step-by-Step Fix

### Step 1: Go to Render Dashboard
1. https://dashboard.render.com
2. Click your service: `crud-assignment-1`

### Step 2: Check Service Type
- Look at the top - must say **"Web Service"**
- If it says "Static Site" → Delete and recreate as Web Service

### Step 3: Update Build Command
1. Go to **Settings** → **Build & Deploy**
2. Find **Build Command**
3. Set to: `npm install && npm run build && cd backend && npm install && cd ..`
4. **Save Changes**

### Step 4: Update Start Command
1. Still in **Settings** → **Build & Deploy**
2. Find **Start Command**
3. Set to: `node backend/src/server.js`
4. **Save Changes**

### Step 5: Verify Root Directory
1. Still in **Settings** → **Build & Deploy**
2. Find **Root Directory**
3. Should be: `.` (empty/root)
4. If different, change to `.` and **Save**

### Step 6: Redeploy
1. Go to **Manual Deploy** → **Deploy latest commit**
2. Watch the **Logs** tab

### Step 7: Check Build Logs

**✅ CORRECT build logs:**
```
npm install
npm run build
The build folder is ready to be deployed.
cd backend && npm install
added 50 packages
==> Build successful 🎉
```

**✅ CORRECT runtime logs:**
```
==> Running 'npm run start'
> node backend/src/server.js
🚀 Starting Server
✅ Server listening on port 10000
```

**❌ WRONG logs (if you see this):**
```
> react-scripts start
Starting the development server...
```

### Step 8: Test After Deploy

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

## If Still Getting "Cannot find module 'cors'"

This means backend dependencies aren't installing. Try:

### Option 1: More Explicit Build Command
Change Build Command to:
```bash
npm install && npm run build && (cd backend && npm install --verbose && cd ..) && echo "Backend dependencies installed"
```

### Option 2: Check Build Logs
Look for this in build logs:
```
cd backend && npm install
added 50 packages
```

If you DON'T see this, the backend install isn't running.

### Option 3: Manual Install Script
Create `install-backend.sh`:
```bash
#!/bin/bash
cd backend
npm install
cd ..
```

Then change Build Command to:
```bash
npm install && npm run build && bash install-backend.sh
```

## Quick Checklist

- [ ] Service Type = **Web Service** (not Static Site)
- [ ] Root Directory = `.` (empty)
- [ ] Build Command = `npm install && npm run build && cd backend && npm install && cd ..`
- [ ] Start Command = `node backend/src/server.js` (NOT `npm start`, NOT `react-scripts start`)
- [ ] Build logs show "cd backend && npm install"
- [ ] Runtime logs show "🚀 Starting Server" (NOT "Starting the development server")
- [ ] `/api/health` returns `{"status":"ok"}`

## Still Not Working?

1. **Delete the service** completely
2. **Create new Web Service** from scratch
3. **Manually set** all settings (don't rely on render.yaml)
4. Use these exact values:
   - Root Directory: `.`
   - Build Command: `npm install && npm run build && cd backend && npm install && cd ..`
   - Start Command: `node backend/src/server.js`
5. Set environment variables
6. Deploy

The code is correct - the issue is Render configuration in the dashboard!
