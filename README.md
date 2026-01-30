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

1. **One service (recommended)**  
   Use repo root so the same app serves both API and React:
   - **Root Directory**: leave empty (repo root)
   - **Build Command**: `npm install && npm run build && cd backend && npm install`
   - **Start Command**: `node backend/src/server.js`
   - **Environment**: set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (and `DB_PORT` if needed) to your production MySQL (e.g. Render MySQL, PlanetScale, or other cloud DB). Do not use `localhost` for production.

2. **Health check**: Render can use `GET /api/health` as the health path.

3. The app uses relative `/api/v1` so the frontend and API run on the same host with no 404s. All routes (including refresh) serve the React app; only `/api/*` hits the backend.
