require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Auto-create tasks table on startup (for deployment)
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.error('DB init:', err.message);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/tasks', tasksRouter);

// Serve frontend for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, async () => {
  await initDb();
  console.log(`Server running on port ${PORT}`);
});
