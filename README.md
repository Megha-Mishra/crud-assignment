# Student Management Full Stack

Full stack CRUD application for managing students with pagination. The backend
uses Node.js, Express, and MySQL. The frontend uses React, Bootstrap, and
SweetAlert2.

## Database Setup

```sql
CREATE DATABASE student_db;

USE student_db;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  age INT NOT NULL
);
```

## Backend (Node.js + MySQL)

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Environment variables in `backend/.env`:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_db
DB_PORT=3306
```

### API Endpoints

- `POST /api/v1/students`
- `GET /api/v1/students?page=1&limit=10`
- `GET /api/v1/students/:id`
- `PUT /api/v1/students/:id`
- `DELETE /api/v1/students/:id`

## Frontend (React)

```bash
npm install
npm start
```

Optional (only if API is on a different host):

```
REACT_APP_API_URL=https://your-backend.onrender.com/api/v1
```

## Deploy to Render (https://crud-assignment-1-a3d7.onrender.com)

**Important:** The service **must** be a **Web Service** (Node), **not** a Static Site. If you use Static Site, `/api/v1/students` will return 404 because no Node server runs.

1. **Create or convert to Web Service**
   - In Render: **New → Web Service** (not Static Site).
   - Connect your repo.

2. **Settings**
   - **Root Directory**: leave empty (repo root).
   - **Build Command**: `npm install && npm run build && cd backend && npm install`
   - **Start Command**: `node backend/src/server.js`
   - **Environment**: set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (and `DB_PORT` if needed) to your production MySQL. Do not use `localhost` for production.

3. **Health check**: Use `GET /api/health` as the health check path in Render.

4. Deploy. The same URL will serve the React app and the API; `/api/v1/students` will work.

### If you see 404 for `/api/v1/students`

- **Cause:** The service is a **Static Site** (only files, no Node server).
- **Fix:** Delete the Static Site and create a **Web Service** (Node) with the Build and Start commands above, or in the existing service change the type to Web Service and set Root Directory, Build Command, and Start Command as above.
