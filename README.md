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

Optional environment variable:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```
