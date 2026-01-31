# Task Management Web Application

A full-stack Task Management application built with Node.js, Express, MySQL, and vanilla HTML/CSS/JavaScript for the Global Trend Full Stack Internship Assignment.

## Features

- **CRUD Operations**: Create, view, update, and delete tasks
- **Task Fields**: Title, Description, Status (Pending, In Progress, Completed)
- **Responsive UI**: Works on desktop, tablet, and mobile
- **Filter**: Filter tasks by status
- **REST API**: Clean API design for all task operations

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Backend**: Node.js, Express
- **Database**: MySQL

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://www.mysql.com/) (v5.7 or higher)
- npm (comes with Node.js)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd task-management-app
```

### 2. Create MySQL Database

Start MySQL and run the schema script to create the database and table:

```bash
mysql -u root -p < database/schema.sql
```

Or manually in MySQL client:

```sql
CREATE DATABASE IF NOT EXISTS task_management;
USE task_management;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. Configure Environment (Optional)

Copy `backend/.env.example` to `backend/.env` and update if your MySQL credentials differ from defaults:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_management
PORT=5000
```

### 4. Install Dependencies & Run

```bash
cd backend
npm install
npm start
```

### 5. Open the Application

Navigate to [http://localhost:5000](http://localhost:5000) in your browser.

## API Endpoints

| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| GET    | /api/tasks      | Get all tasks        |
| GET    | /api/tasks/:id  | Get task by ID       |
| POST   | /api/tasks      | Create new task      |
| PUT    | /api/tasks/:id  | Update task          |
| DELETE | /api/tasks/:id  | Delete task          |

### Request/Response Examples

**Create Task (POST /api/tasks)**

```json
// Request
{
  "title": "Complete assignment",
  "description": "Finish the Global Trend task",
  "status": "in_progress"
}

// Response (201)
{
  "id": 1,
  "title": "Complete assignment",
  "description": "Finish the Global Trend task",
  "status": "in_progress",
  "created_at": "2025-01-31T10:00:00.000Z"
}
```

**Update Task (PUT /api/tasks/:id)**  
Same body structure as create.

**Valid status values**: `pending`, `in_progress`, `completed`

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js          # MySQL connection pool
│   ├── routes/
│   │   └── tasks.js       # Task CRUD routes
│   ├── server.js          # Express app entry point
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── database/
│   └── schema.sql         # Database schema
└── README.md
```

## Deployment

### Railway (Recommended)

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) and sign in with GitHub
3. **New Project** → **Deploy from GitHub repo** → select your repo
4. Add **MySQL** from Railway's templates (or use your existing MySQL URL)
5. For the web service, set **Root Directory** to `backend` (or leave default - the root package.json handles it)
6. Add environment variables (if using Railway MySQL, it auto-injects `MYSQL_URL`):
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (or use `MYSQL_URL` from Railway MySQL)
7. Deploy and use the generated URL

### Render

1. Push to GitHub, then go to [render.com](https://render.com)
2. **New** → **Web Service** → connect your repo
3. Set **Build Command**: `cd backend && npm install`
4. Set **Start Command**: `cd backend && npm start`
5. Add environment variables for your MySQL connection
6. Deploy

## License

MIT
