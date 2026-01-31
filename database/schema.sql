-- Task Management Database Schema
-- Run this script in MySQL Workbench
-- Creates database and tasks table

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

-- Optional: Insert sample data for testing
-- INSERT INTO tasks (title, description, status) VALUES
-- ('Sample Task 1', 'This is a sample task description', 'pending'),
-- ('Sample Task 2', 'Another sample task', 'in_progress');
