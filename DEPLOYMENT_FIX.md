# Fix 404 Error on Render Deployment

## The Problem
Getting `404 Cannot GET /api/v1/students` means the **Node/Express server is NOT running**.

## Root Cause
If your Render service is a **Static Site** (not Web Service), only HTML/CSS/JS files are served. There's no Node server to handle `/api/*` routes, so you get 404.

## ✅ Solution: Deploy as Web Service (Node)

### Step 1: Check Your Service Type
1. Go to Render Dashboard → Your Service
2. Check the **Service Type**:
   - ❌ **Static Site** = Wrong (causes 404)
   - ✅ **Web Service** = Correct

### Step 2: If It's Static Site, Convert to Web Service
**Option A: Create New Web Service**
1. Delete the Static Site
2. Create **New → Web Service**
3. Connect your repo
4. Use settings below

**Option B: Convert Existing Service**
1. Go to Settings → General
2. Change service type (if possible) OR
3. Delete and recreate as Web Service

### Step 3: Configure Web Service Settings

**In Render Dashboard:**

| Setting | Value |
|---------|-------|
| **Name** | crud-assignment-1 (or any name) |
| **Root Directory** | `.` (leave empty for repo root) |
| **Environment** | Node |
| **Build Command** | `npm install && npm run build && cd backend && npm install` |
| **Start Command** | `node backend/src/server.js` |
| **Auto-Deploy** | Yes |

### Step 4: Set Environment Variables

Go to **Environment** tab and add:

```
DB_HOST=your-production-mysql-host
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=student_db
DB_PORT=3306
```

**⚠️ Important:** Use your **production MySQL** (Render MySQL, PlanetScale, etc.). Do NOT use `localhost`.

### Step 5: Deploy

1. Click **Manual Deploy** or push to your repo
2. Wait for build to complete
3. Check **Logs** tab to see:
   ```
   Server listening on port 10000
   API routes available:
     GET /api/health
     GET /api/v1/students
   ```

### Step 6: Test

After deployment, test these URLs:

1. **Health Check:**
   ```
   https://crud-assignment-1-a3d7.onrender.com/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Test Route:**
   ```
   https://crud-assignment-1-a3d7.onrender.com/api/test
   ```
   Should return: `{"success":true,"message":"Server is running",...}`

3. **Students API:**
   ```
   https://crud-assignment-1-a3d7.onrender.com/api/v1/students?page=1&limit=5
   ```
   Should return JSON (not 404)

4. **Frontend:**
   ```
   https://crud-assignment-1-a3d7.onrender.com/
   ```
   Should show React app

## Still Getting 404?

### Check Render Logs
1. Go to **Logs** tab in Render
2. Look for:
   - `Server listening on port...` ✅ Server is running
   - `Build folder exists: true` ✅ Build found
   - Any errors ❌ Fix errors

### Common Issues

1. **"Cannot find module"**
   - Build command didn't run `cd backend && npm install`
   - Fix: Check Build Command is correct

2. **"Build folder not found"**
   - Build command didn't create `build/` folder
   - Fix: Ensure `npm run build` runs before backend install

3. **Database connection errors**
   - Wrong DB_HOST (using localhost)
   - Fix: Set production DB credentials in Environment Variables

4. **Port errors**
   - Render sets PORT automatically
   - Fix: Don't hardcode PORT, use `process.env.PORT`

## Quick Verification Checklist

- [ ] Service Type = **Web Service** (not Static Site)
- [ ] Root Directory = `.` (repo root)
- [ ] Build Command = `npm install && npm run build && cd backend && npm install`
- [ ] Start Command = `node backend/src/server.js`
- [ ] Environment Variables set (DB_HOST, DB_USER, etc.)
- [ ] Logs show "Server listening on port..."
- [ ] `/api/health` returns `{"status":"ok"}`
- [ ] `/api/v1/students` returns JSON (not 404)

## Need Help?

If still having issues, check:
1. Render service logs (most important!)
2. Build logs for errors
3. Environment variables are set correctly
4. Database is accessible from Render (not localhost)
