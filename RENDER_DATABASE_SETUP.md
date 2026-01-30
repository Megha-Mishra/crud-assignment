# Fix 500 Error on Render – Database Setup

## Why You Get 500 on `/api/v1/students`

A **500 Internal Server Error** on `GET /api/v1/students` usually means:

1. The backend is running (no more 404).
2. The request reaches the server.
3. The **database connection fails** (MySQL not reachable or wrong config).

So the next step is to fix the database configuration on Render.

---

## 1. Check Database Health

After deploying, open:

**https://crud-assignment-1-a3d7.onrender.com/api/health/db**

- If you see `"database": "connected"` → DB is OK; 500 is something else (check Render logs).
- If you see `"database": "disconnected"` or an error → DB connection is wrong (see below).

---

## 2. Set Environment Variables on Render

Render does **not** use your local `.env`. You must set variables in the dashboard.

1. Go to **Render Dashboard** → your service → **Environment**.
2. Add (or fix) these:

| Key         | Value                    | Example / notes                          |
|------------|---------------------------|------------------------------------------|
| `DB_HOST`  | Your MySQL host           | **Not** `localhost`. Use your DB host URL. |
| `DB_USER`  | MySQL username             | e.g. `root` or your DB user              |
| `DB_PASSWORD` | MySQL password          | Same as in your DB provider              |
| `DB_NAME`  | Database name              | e.g. `student_db`                         |
| `DB_PORT`  | MySQL port                 | Usually `3306`                            |

- If you use **Render MySQL**: create a MySQL instance in Render, then copy its **Internal Database URL** (or host/user/password) into these env vars.
- If you use **PlanetScale**, **Railway**, **AWS RDS**, etc.: use the host/user/password/port they give you.

`DB_HOST` must be a hostname that Render’s servers can reach (e.g. `xxx.planetscale.com`, or the host from Render MySQL). **Never use `localhost`** for production on Render.

---

## 3. Create the Database and Table

Your MySQL server must have:

1. A **database** with the name you set in `DB_NAME` (e.g. `student_db`).
2. A **table** `students` with the expected columns.

Run this (e.g. in MySQL client or your provider’s SQL console):

```sql
CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  age INT NOT NULL
);
```

---

## 4. Verify Again

1. Save env vars on Render and **redeploy** (or wait for auto-deploy).
2. Open: **https://crud-assignment-1-a3d7.onrender.com/api/health/db**
   - Should return `"database": "connected"`.
3. Then open: **https://crud-assignment-1-a3d7.onrender.com/api/v1/students?page=1&limit=5**
   - Should return **200** with JSON (e.g. `{ "success": true, "data": [], "meta": { ... } }`).

---

## 5. Check Render Logs

If it still returns 500:

1. In Render: your service → **Logs** (runtime logs).
2. Look for lines like:
   - `Database connection failed`
   - `ECONNREFUSED`
   - `ER_ACCESS_DENIED_ERROR`
   - `ER_BAD_DB_ERROR`

Those messages tell you whether the problem is host/port, credentials, or missing database/table.

---

## Quick Checklist

- [ ] `DB_HOST` set on Render (not localhost).
- [ ] `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` set on Render.
- [ ] MySQL server allows connections from Render (e.g. “allow from anywhere” or Render IPs if required).
- [ ] Database `student_db` (or your `DB_NAME`) exists.
- [ ] Table `students` exists with `id`, `name`, `email`, `age`.
- [ ] `/api/health/db` returns `"database": "connected"`.
- [ ] `/api/v1/students` returns 200 with JSON.

Once the DB is correct, the 500 on `/api/v1/students` should go away.
