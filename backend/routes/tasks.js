const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, status, created_at FROM tasks ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET single task by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, status, created_at FROM tasks WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !status) {
      return res.status(400).json({ error: 'Title and status are required' });
    }

    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Status must be one of: pending, in_progress, completed',
      });
    }

    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
      [title, description || '', status]
    );

    const [newTask] = await pool.query(
      'SELECT id, title, description, status, created_at FROM tasks WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newTask[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    const message = error.code === 'ER_NO_SUCH_TABLE'
      ? 'Tasks table not found. Run database/schema.sql in MySQL first.'
      : error.code === 'ER_BAD_DB_ERROR'
      ? 'Database not found. Run database/schema.sql in MySQL first.'
      : error.message || 'Failed to create task';
    res.status(500).json({ error: message });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !status) {
      return res.status(400).json({ error: 'Title and status are required' });
    }

    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Status must be one of: pending, in_progress, completed',
      });
    }

    const [result] = await pool.query(
      'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
      [title, description || '', status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const [updatedTask] = await pool.query(
      'SELECT id, title, description, status, created_at FROM tasks WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedTask[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
